// src/app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaLock, FaUserAlt, FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

type LoginErrors = {
  email: string;
  password: string;
  server: string;
};

export default function LoginPage() {
  const router = useRouter();


  const [form, setForm] = useState<LoginForm>({ email: "", password: "", remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({ email: "", password: "", server: "" });

  function updateField<K extends keyof LoginForm>(key: K, value: LoginForm[K]) {
    setForm((s) => ({ ...s, [key]: value }));
    // clear specific error
    if (key === "email") setErrors((e) => ({ ...e, email: "", server: "" }));
    if (key === "password") setErrors((e) => ({ ...e, password: "", server: "" }));
  }

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function validate(): boolean {
    let ok = true;
    const next: LoginErrors = { email: "", password: "", server: "" };

    if (!form.email.trim()) {
      next.email = "Please enter your email address.";
      ok = false;
    } else if (!isValidEmail(form.email.trim())) {
      next.email = "Please enter a valid email (example: name@gmail.com).";
      ok = false;
    }

    if (!form.password) {
      next.password = "Please enter your password.";
      ok = false;
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters long.";
      ok = false;
    }

    setErrors(next);
    return ok;
  }

  // Utility: read users array from localStorage (created by your signup page)
  function readLocalUsers(): { name?: string; email: string; mobile?: string; password: string }[] {
    try {
      const raw = localStorage.getItem("sx_users");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setErrors((s) => ({ ...s, server: "" }));

  if (!validate()) return;

  setLoading(true);

  try {
    const res = await fetch("/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",   // 🔥 IMPORTANT
  body: JSON.stringify({
    email: form.email,
    password: form.password,
  }),
});

    const data = await res.json();
    console.log("LOGIN RESPONSE:", res.status, data);

    if (!res.ok) {
      setErrors((s) => ({
        ...s,
        server: data.message || "Login failed",
      }));
      return;
    }

    // ✅ FIX: wait for cookie to be set before redirect
// ✅ FINAL FIX (proper redirect + refresh)
router.push("/dashboard");
router.refresh();

  } catch (err: any) {
    setErrors((s) => ({
      ...s,
      server: err?.message || "Login failed. Try again later.",
    }));
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen flex items-stretch bg-[var(--sx-slate-50)]">
      {/* LEFT image / marketing panel */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/login-people.png')" }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-white max-w-xl px-10 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Welcome Back to ScrapXchange</h2>
          <p className="text-lg text-white/90 mb-6">Fast, secure, and trusted scrap trades across India.</p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">Verified Traders</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">24/7 Support</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">Pan-India</span>
          </div>
        </div>
      </div>

      {/* RIGHT login panel */}
      <div className="flex-1 flex items-center justify-center p-10 bg-white">
        <div className="max-w-md w-full shadow-xl border border-slate-200 rounded-2xl p-8">
          {/* logo/title */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[var(--sx-green-700)] rounded-lg text-white flex items-center justify-center text-xl font-bold mx-auto">
              SX
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mt-3">Sign in to ScrapXchange</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in with your account to continue</p>
          </div>

          {/* social logins */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button type="button" className="flex items-center gap-2 justify-center border rounded-lg px-3 py-2 text-sm hover:shadow transition bg-white">
              <FaGoogle className="text-red-500" /> Google
            </button>
            <button type="button" className="flex items-center gap-2 justify-center border rounded-lg px-3 py-2 text-sm hover:shadow transition bg-white">
              <FaFacebookF className="text-blue-600" /> Facebook
            </button>
            <button type="button" className="flex items-center gap-2 justify-center border rounded-lg px-3 py-2 text-sm hover:shadow transition bg-white">
              <FaApple className="text-black" /> Apple
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <span className="h-px w-full bg-slate-200 absolute" />
            <span className="relative px-3 bg-white text-xs text-slate-400">or sign in with email</span>
          </div>

          {/* form */}
          <form
  onSubmit={handleSubmit} className="space-y-4" noValidate>

            <label className="block">
              <span className="text-sm text-slate-600">Email</span>
              <div className="mt-1 relative">
                <input
 
  type="email"
  name="email"
  autoComplete="email"
  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full border rounded-md pr-10 pl-3 py-2 text-sm focus:ring-2 focus:ring-[var(--sx-green-700)]
                    ${errors.email ? "border-red-300 bg-red-50" : "border-slate-300 bg-white"}`}
                  aria-invalid={!!errors.email}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaUserAlt />
                </span>
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Password</span>
              <div className="mt-1 relative">
                <input
  
  type={showPass ? "text" : "password"}
  name="password"
  autoComplete="current-password"
  value={form.password}
                 
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Your password"
                  className={`w-full border rounded-md pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-[var(--sx-green-700)]
                    ${errors.password ? "border-red-300 bg-red-50" : "border-slate-300 bg-white"}`}
                  aria-invalid={!!errors.password}
                />
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => updateField("remember", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span className="text-slate-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[var(--sx-green-700)] hover:underline">
                Forgot password?
              </Link>
            </div>

            {errors.server && <div className="text-sm text-red-500">{errors.server}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[var(--sx-green-700)] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[var(--sx-green-800)] transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[var(--sx-green-700)] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
