import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/AuthContext";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }
    if (password.length < 6) {
      setError("رمز عبور حداقل ۶ کاراکتر باشد");
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      window.location.href = returnTo || "/";
    } catch (err) {
      setError(err.message || "ثبت‌نام ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout icon={UserPlus} title="ثبت‌نام" subtitle="حساب جدید بسازید">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-2">{error}</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">رمز عبور</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">تکرار رمز</Label>
          <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required dir="ltr" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : "ثبت‌نام"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link to="/login" className="text-primary underline">ورود</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
