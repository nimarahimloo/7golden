import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { requireAuth, requireAdmin, type AuthRequest } from '../middleware/auth.js';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\//i.test(file.mimetype)) return cb(new Error('فقط تصویر مجاز است'));
    cb(null, true);
  },
});

const router = Router();

router.post('/', requireAuth, requireAdmin, (req: AuthRequest, res) => {
  upload.single('file')(req, res, async (err: any) => {
    try {
      if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
      if (!req.file) return res.status(400).json({ error: 'فایلی ارسال نشد' });

      const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const originalName = (req.file.originalname || 'image').replace(/\.[^.]+$/, '');
      const altDefault =
        (typeof req.body?.alt === 'string' && req.body.alt.trim()) ||
        originalName.replace(/[_-]+/g, ' ').trim() ||
        'تصویر 7Golden';

      let filename = `${baseName}.webp`;
      let outPath = path.join(uploadDir, filename);

      try {
        // near-lossless / high quality WebP
        await sharp(req.file.buffer)
          .rotate() // respect EXIF
          .webp({ quality: 92, alphaQuality: 100, effort: 4 })
          .toFile(outPath);
      } catch (convErr: any) {
        // fallback: keep original extension
        const ext = path.extname(req.file.originalname || '').toLowerCase() || '.jpg';
        filename = `${baseName}${ext}`;
        outPath = path.join(uploadDir, filename);
        fs.writeFileSync(outPath, req.file.buffer);
        console.warn('webp convert failed, saved original', convErr?.message);
      }

      const file_url = `/uploads/${filename}`;
      res.json({
        file_url,
        url: file_url,
        alt: altDefault,
        filename,
        mime: filename.endsWith('.webp') ? 'image/webp' : req.file.mimetype,
      });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Upload error' });
    }
  });
});

export default router;
