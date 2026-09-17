import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // Always show success regardless
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="بازیابی رمز عبور"
      subtitle="لینک بازیابی برای شما ارسال می‌شود"
      footer={
        <Link to="/login" className="font-medium hover:underline inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
          <ArrowRight className="w-3 h-3" />
          بازگشت به ورود
        </Link>
      }
    >
      {sent ? (
        <p className="font-body text-sm text-center" style={{ color: "var(--fg)" }}>
          اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی رمز عبور به‌زودی برای شما ارسال می‌شود.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-body text-sm" style={{ color: "var(--fg)" }}>آدرس ایمیل</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-muted)" }} aria-hidden="true" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                در حال ارسال...
              </>
            ) : (
              "ارسال لینک بازیابی"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}