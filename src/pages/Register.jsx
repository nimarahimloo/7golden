import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import AppleIcon from "@/components/AppleIcon";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "ثبت‌نام ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "کد تأیید اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "کد ارسال شد", description: "کد جدید را در ایمیل خود بررسی کنید." });
    } catch (err) {
      setError(err.message || "ارسال مجدد ناموفق بود");
    }
  };

  const handleGoogle = () => base44.auth.loginWithProvider("google", safeReturnTo());
  const handleApple = () => base44.auth.loginWithProvider("apple", safeReturnTo());

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="تأیید ایمیل"
        subtitle={`کد ۶ رقمی به ${email} ارسال شد`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm font-body" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6" dir="ltr">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-medium"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
          style={{ background: "var(--accent)", color: "hsl(var(--accent-foreground))" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              در حال تأیید...
            </>
          ) : (
            "تأیید کد"
          )}
        </Button>
        <p className="text-center font-body text-sm mt-4" style={{ color: "var(--fg-muted)" }}>
          کد را دریافت نکرده‌اید؟{" "}
          <button onClick={handleResend} className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
            ارسال مجدد
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="ساخت حساب کاربری"
      subtitle="در کمتر از یک دقیقه ثبت‌نام کنید"
      footer={
        <>
          حساب دارید؟{" "}
          <Link
            to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")}
            className="font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            وارد شوید
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-3"
        onClick={handleGoogle}
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "var(--fg)" }}
      >
        <GoogleIcon className="w-5 h-5 ml-2" />
        ثبت‌نام با گوگل
      </Button>

      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleApple}
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "var(--fg)" }}
      >
        <AppleIcon className="w-5 h-5 ml-2" />
        ثبت‌نام با اپل
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 font-body" style={{ color: "var(--fg-muted)", background: "rgba(13,13,13,0.52)" }}>یا</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm font-body" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-body text-sm" style={{ color: "var(--fg)" }}>ایمیل</Label>
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
        <div className="space-y-2">
          <Label htmlFor="password" className="font-body text-sm" style={{ color: "var(--fg)" }}>رمز عبور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-muted)" }} aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              در حال ثبت...
            </>
          ) : (
            "ثبت‌نام"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}