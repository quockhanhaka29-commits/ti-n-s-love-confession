import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  ssr: false,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setMsg("Đã gửi mail xác nhận (nếu cần). Sau đó bạn có thể đăng nhập.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      setMsg(err.message ?? "Đã có lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <form onSubmit={submit} className="w-full max-w-sm glass rounded-2xl p-8 space-y-4">
        <h1 className="text-2xl font-light text-gradient text-center">Admin</h1>
        <p className="text-xs text-muted-foreground text-center">Chỉ dành cho quản trị viên</p>
        <input
          type="email" required autoComplete="email"
          placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white"
        />
        <input
          type="password" required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white"
        />
        <button disabled={loading} className="glow-pink w-full rounded-full bg-gradient-to-r from-pink to-secondary px-6 py-3 text-sm text-primary-foreground disabled:opacity-60">
          {loading ? "..." : mode === "signin" ? "Đăng nhập" : "Đăng ký"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-xs text-lavender underline">
          {mode === "signin" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </button>
        {msg && <p className="text-xs text-soft-pink text-center">{msg}</p>}
        <Link to="/" className="block text-center text-xs text-muted-foreground">← Về trang chính</Link>
      </form>
    </div>
  );
}