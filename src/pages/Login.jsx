import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import AppleIcon from "@/components/AppleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || "ایمیل یا رمز عبور اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => base44.auth.loginWithProvider("google", returnTo);
  const handleApple = () => base44.auth.loginWithProvider("apple", returnTo);

  return (
    <AuthLayout
      icon={LogIn}
      title="ورود به حساب"
      subtitle="خوش آمدید — وارد شوید"
      footer={
        <>
          حساب ندارید؟{" "}
          <Link
            to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
            className="font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            ثبت‌نام کنید
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
        ورود با گوگل
      </Button>

      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleApple}
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "var(--fg)" }}
      >
        <AppleIcon className="w-5 h-5 ml-2" />
        ورود با اپل
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-body text-sm" style={{ color: "var(--fg)" }}>رمز عبور</Label>
            <Link to="/forgot-password" className="text-xs font-body hover:underline" style={{ color: "var(--accent)" }}>
              فراموشی رمز؟
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--fg-muted)" }} aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              در حال ورود...
            </>
          ) : (
            "ورود"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}