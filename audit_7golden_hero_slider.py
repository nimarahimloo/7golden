#!/usr/bin/env python3
"""Read-only inventory of 7Golden's hero slider/admin/database implementation.

Run from anywhere:
    python3 audit_7golden_hero_slider.py /path/to/7golden --output hero-slider-audit.md

This script only reads project files. It does not modify application source, run
package scripts, connect to databases, read .env files, or print secret values.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

SKIP_DIRS = {
    ".git", ".hg", ".svn", "node_modules", "vendor", "dist", "build",
    ".next", ".nuxt", ".output", "coverage", "playwright-report",
    "test-results", "__pycache__", ".venv", "venv", "env", ".turbo",
    ".cache", "tmp", "temp", "storage", "uploads", "public/assets",
}
SKIP_NAMES = {
    ".env", ".env.local", ".env.production", ".env.development",
    "pnpm-lock.yaml", "package-lock.json", "yarn.lock", "bun.lockb",
    "composer.lock", "Cargo.lock", "poetry.lock", "uv.lock",
}
TEXT_EXTS = {
    ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".vue", ".svelte",
    ".json", ".jsonc", ".yaml", ".yml", ".toml", ".md", ".mdx", ".html",
    ".css", ".scss", ".sass", ".less", ".py", ".php", ".rb", ".go", ".rs",
    ".java", ".kt", ".sql", ".prisma", ".graphql", ".gql", ".sh", ".xml",
    ".conf", ".properties", ".example", ".sample",
}
MAX_FILE_BYTES = 1_500_000
MAX_FILES_DEFAULT = 20_000
MAX_SNIPPETS_PER_FILE = 8
MAX_SNIPPET_CHARS = 210

PATTERNS: dict[str, list[str]] = {
    "slide_content_and_frontend": [
        r"\bBASE_SLIDES\b", r"hero-nuts-bowl\.webp", r"hazelnut-spoon\.webp",
        r"tray-pistachio-almond\.webp", r"Hero-Banner-main\.webp",
        r"HeroBanner-1\.webp", r"Hero-banner-2\.webp", r"imagePosition",
        r"hero.?slides?", r"hero.?slider", r"carousel", r"swiper",
    ],
    "admin_and_content_management": [
        r"\badmin\b", r"\bCMS\b", r"content.?management", r"slider.?management",
        r"manage.?slides?", r"upload", r"multipart/form-data", r"multer",
    ],
    "api_and_routes": [
        r"\b(api|router|routes?)\b", r"app\.(get|post|put|patch|delete)\s*\(",
        r"router\.(get|post|put|patch|delete)\s*\(", r"createRouter",
        r"NestFactory", r"Controller\(", r"Route::(get|post|put|patch|delete)",
    ],
    "database_and_models": [
        r"\b(prisma|sequelize|typeorm|mongoose|drizzle|knex)\b", r"\bmodel\b",
        r"schema\.prisma", r"CREATE TABLE", r"\bmodels?/", r"\bentity\b",
        r"\b(slide|slider|hero_slide|hero_slides)\b",
    ],
    "migrations_and_seeders": [
        r"\bmigrations?\b", r"\bseeders?\b", r"\bseed\b", r"prisma\s+db\s+seed",
        r"MigrationInterface", r"Schema::create", r"CREATE TABLE",
    ],
    "test_and_ci": [
        r"\bdescribe\s*\(", r"\bit\s*\(", r"\btest\s*\(",
        r"vitest", r"jest", r"playwright", r"\.github/workflows",
    ],
}
COMPILED = {group: [(raw, re.compile(raw, re.IGNORECASE)) for raw in pats]
            for group, pats in PATTERNS.items()}


def is_skipped_dir(name: str) -> bool:
    return name in SKIP_DIRS or name.startswith(".venv")


def safe_read(path: Path) -> str | None:
    try:
        if path.name in SKIP_NAMES or path.name.startswith(".env"):
            return None
        if path.suffix.lower() not in TEXT_EXTS and path.name not in {"Dockerfile", "Makefile", "Procfile"}:
            return None
        if path.stat().st_size > MAX_FILE_BYTES:
            return None
        return path.read_text(encoding="utf-8", errors="replace")
    except (OSError, UnicodeError):
        return None


def classify_path(path: Path) -> list[str]:
    p = str(path).lower().replace("\\", "/")
    result = []
    tokens = {
        "likely_frontend": ("frontend", "client", "src/pages", "src/components", "app/", "pages/", "components/", "web/"),
        "likely_admin": ("admin", "dashboard", "cms", "backoffice"),
        "likely_backend": ("backend", "server", "api/", "routes/", "controllers", "services/"),
        "likely_migration_or_seed": ("migration", "migrations", "seeder", "seeders", "/seed", "prisma/seed"),
        "likely_test": ("test", "spec", "__tests__", "e2e"),
    }
    for label, needles in tokens.items():
        if any(n in p for n in needles):
            result.append(label)
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="Project root (default: current directory)")
    parser.add_argument("--output", "-o", default="", help="Write Markdown report to this path")
    parser.add_argument("--json", dest="json_output", default="", help="Also write machine-readable JSON to this path")
    parser.add_argument("--max-files", type=int, default=MAX_FILES_DEFAULT, help="Maximum number of files to inspect")
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not root.exists() or not root.is_dir():
        print(f"ERROR: project directory does not exist: {root}", file=sys.stderr)
        return 2

    all_source_count = 0
    scanned_count = 0
    unreadable_or_skipped = 0
    extension_counts: Counter[str] = Counter()
    matched_files: dict[str, list[dict[str, Any]]] = defaultdict(list)
    likely_files: list[dict[str, Any]] = []
    manifest_files: list[dict[str, Any]] = []
    slide_asset_refs: Counter[str] = Counter()
    warnings: list[str] = []

    for current, dirs, files in os.walk(root):
        dirs[:] = sorted(d for d in dirs if not is_skipped_dir(d))
        current_path = Path(current)
        for name in sorted(files):
            path = current_path / name
            rel = path.relative_to(root).as_posix()
            if name in SKIP_NAMES or name.startswith(".env"):
                unreadable_or_skipped += 1
                continue
            if path.suffix.lower() in TEXT_EXTS or name in {"Dockerfile", "Makefile", "Procfile"}:
                all_source_count += 1
                extension_counts[path.suffix.lower() or "[no extension]"] += 1
            if len(likely_files) >= args.max_files:
                warnings.append(f"Reached --max-files limit ({args.max_files}); inventory may be incomplete.")
                break
            content = safe_read(path)
            if content is None:
                unreadable_or_skipped += 1
                continue
            scanned_count += 1

            path_classes = classify_path(path.relative_to(root))
            relevant = False
            path_signal = bool(re.search(r"hero|slider|slide|carousel|admin|migration|seeder|seed|prisma|schema|route|controller|model|api", rel, re.I))
            if path_signal:
                likely_files.append({"path": rel, "classes": path_classes, "bytes": path.stat().st_size})
                relevant = True

            group_hits: dict[str, list[dict[str, Any]]] = {}
            lines = content.splitlines()
            for group, patterns in COMPILED.items():
                hits = []
                for line_no, line in enumerate(lines, 1):
                    if any(rx.search(line) for _, rx in patterns):
                        # Avoid leaking environment-like values; source files only and snippets truncated.
                        snippet = re.sub(r"(?i)(password|secret|token|api[_-]?key)\s*[:=]\s*[^,;\s]+", r"\1=[REDACTED]", line.strip())
                        hits.append({"line": line_no, "text": snippet[:MAX_SNIPPET_CHARS]})
                        if len(hits) >= MAX_SNIPPETS_PER_FILE:
                            break
                if hits:
                    group_hits[group] = hits
                    relevant = True
            if group_hits:
                matched_files[rel] = [{"category": group, "hits": hits} for group, hits in group_hits.items()]
                for line in lines:
                    for asset in (
                        "hero-nuts-bowl.webp", "hazelnut-spoon.webp", "tray-pistachio-almond.webp",
                        "Hero-Banner-main.webp", "HeroBanner-1.webp", "Hero-banner-2.webp",
                    ):
                        if asset in line:
                            slide_asset_refs[asset] += 1

            if name in {"package.json", "composer.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "go.mod", "Dockerfile", "docker-compose.yml", "compose.yml", "schema.prisma"} or "prisma/schema.prisma" in rel:
                manifest_files.append({"path": rel, "bytes": path.stat().st_size})
        if warnings:
            break

    # Heuristic score helps point to the best starting files, without asserting correctness.
    ranked = []
    for rel, groups in matched_files.items():
        cats = {g["category"] for g in groups}
        score = sum({
            "slide_content_and_frontend": 5,
            "admin_and_content_management": 3,
            "api_and_routes": 2,
            "database_and_models": 4,
            "migrations_and_seeders": 4,
            "test_and_ci": 1,
        }.get(c, 0) for c in cats)
        if re.search(r"hero|slider|slide|carousel", rel, re.I):
            score += 4
        if re.search(r"admin|migration|seeder|seed|schema|model|controller|route", rel, re.I):
            score += 2
        ranked.append({"path": rel, "score": score, "categories": sorted(cats)})
    ranked.sort(key=lambda x: (-x["score"], x["path"]))

    report: dict[str, Any] = {
        "project_root": str(root),
        "read_only": True,
        "source_files_found_by_extension": all_source_count,
        "text_files_scanned": scanned_count,
        "files_skipped_or_unreadable": unreadable_or_skipped,
        "extension_counts": dict(sorted(extension_counts.items(), key=lambda x: (-x[1], x[0]))),
        "likely_relevant_file_count": len(likely_files),
        "files_with_keyword_matches_count": len(matched_files),
        "likely_relevant_files": sorted(likely_files, key=lambda x: x["path"]),
        "high_signal_files": ranked[:80],
        "manifest_and_config_files": manifest_files,
        "reference_asset_mentions": dict(slide_asset_refs),
        "keyword_matches_by_file": dict(sorted(matched_files.items())),
        "warnings": warnings,
        "notes": [
            "This is a static text scan, not a complete semantic code review.",
            "A detected file or keyword does not prove that the feature works or is connected end-to-end.",
            "No source files were changed; no database, .env, or secrets were accessed.",
        ],
    }

    md = [
        "# 7Golden Hero Slider — Read-only Project Audit",
        "",
        f"- Project root: `{root}`",
        "- Source changes made: **No**",
        "- Database or `.env` accessed: **No**",
        f"- Source/config files found by extension: **{all_source_count}**",
        f"- Text files scanned: **{scanned_count}**",
        f"- Skipped/unreadable files (includes secret/lock exclusions): **{unreadable_or_skipped}**",
        f"- Likely relevant paths: **{len(likely_files)}**",
        f"- Files with keyword matches: **{len(matched_files)}**",
        "",
        "> This is a static inventory. It identifies places to inspect; it does not certify that the slider is implemented or working.",
        "",
        "## Likely relevant paths",
        "",
    ]
    for item in sorted(likely_files, key=lambda x: x["path"]):
        classes = f" — {', '.join(item['classes'])}" if item["classes"] else ""
        md.append(f"- `{item['path']}` ({item['bytes']} bytes){classes}")
    if not likely_files:
        md.append("- No likely relevant paths found using filenames. Review manifest list and keyword matches.")
    md += ["", "## Highest-signal files", ""]
    if ranked:
        for item in ranked[:40]:
            md.append(f"- `{item['path']}` — score {item['score']}; categories: {', '.join(item['categories'])}")
    else:
        md.append("- No keyword matches found in scanned text files.")
    md += ["", "## Framework/config files", ""]
    if manifest_files:
        md.extend(f"- `{m['path']}` ({m['bytes']} bytes)" for m in manifest_files)
    else:
        md.append("- No common framework manifests found by configured names.")
    md += ["", "## References to the six supplied slide assets", ""]
    for asset in ("hero-nuts-bowl.webp", "hazelnut-spoon.webp", "tray-pistachio-almond.webp", "Hero-Banner-main.webp", "HeroBanner-1.webp", "Hero-banner-2.webp"):
        md.append(f"- `{asset}`: {slide_asset_refs.get(asset, 0)} matching source line(s)")
    md += ["", "## Keyword matches (with line numbers)", ""]
    if matched_files:
        for rel, entries in sorted(matched_files.items()):
            md.append(f"### `{rel}`")
            for entry in entries:
                md.append(f"**{entry['category']}**")
                for hit in entry["hits"]:
                    md.append(f"- L{hit['line']}: `{hit['text'].replace('`', '\\`')}`")
            md.append("")
    else:
        md.append("No matching terms found.")
    if warnings:
        md += ["", "## Warnings", "", *[f"- {w}" for w in warnings]]
    md += ["", "## Interpretation caveats", "", "- Static scan only; no dependencies installed and no tests run.", "- Keyword hits are leads, not proof of complete wiring.", "- No source code changed; no database connection or secret-file read was attempted.", ""]
    markdown = "\n".join(md)

    print(markdown)
    if args.output:
        out = Path(args.output).expanduser().resolve()
        try:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(markdown, encoding="utf-8")
            print(f"\nMarkdown report written to: {out}", file=sys.stderr)
        except OSError as exc:
            print(f"ERROR writing Markdown report: {exc}", file=sys.stderr)
            return 3
    if args.json_output:
        outj = Path(args.json_output).expanduser().resolve()
        try:
            outj.parent.mkdir(parents=True, exist_ok=True)
            outj.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"JSON report written to: {outj}", file=sys.stderr)
        except OSError as exc:
            print(f"ERROR writing JSON report: {exc}", file=sys.stderr)
            return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
