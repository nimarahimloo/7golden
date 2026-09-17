import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken, newPassword });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "بازیابی رمز ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="لینک نامعتبر"
        subtitle="لینک بازیابی رمز عبور ناقص یا نامعتبر است"
        footer={
          <Link to="/forgot-password" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
            درخواست لینک جدید
          </Link>
        }
      >
        <p className="font-body text-sm text-center" style={{ color: "var(--fg)" }}>
          لینک استفاده‌شده ناقص به نظر می‌رسد. لطفاً ایمیل بازیابی رمز عبور را دوباره درخواست کنید.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="رمز عبور جدید"
      subtitle="رمز عبور جدید خود را وارد کنید"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm font-body" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="font-body text-sm" style={{ color: "var(--fg)" }}>رمز عبور جدید</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-muted)" }} aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10 h-12"
              style={{ background: "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.08)", color: "var(--fg)" }}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm" className="font-body text-sm" style={{ color: "var(--fg)" }}>تکرار رمز عبور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-muted)" }} aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10 h-12"
              style={{ background: "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.08)", color: "var(--fg)" }}
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-12 font-medium"
          disabled={loading}
          style={{ background: "var(--accent)", color: "hsl(var(--accent-foreground))" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              در حال بازیابی...
            </>
          ) : (
            "بازیابی رمز"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}