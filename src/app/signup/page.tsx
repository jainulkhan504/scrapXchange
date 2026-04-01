"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaLock,
  FaUserAlt,
  FaPhoneAlt,
  FaGoogle,
  FaApple,
  FaFacebookF,
  FaCheckCircle,
} from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type FormState = {
  name: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successHint, setSuccessHint] = useState<string | null>(null);

  // helpers
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidMobile = (v: string) => /^[6-9]\d{9}$/.test(v);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [field]: value }));
    setServerError(null);
    setSuccessHint(null);
    // live validate this field
    if (touched[field]) {
      const err = validateField(field, { ...form, [field]: value } as FormState);
      setErrors((e) => ({ ...e, [field]: err }));
    }
  }

  function setTouchedField(field: keyof FormState) {
    setTouched((t) => ({ ...t, [field]: true }));
    // validate on first touch/blur
    const err = validateField(field, form);
    setErrors((e) => ({ ...e, [field]: err }));
  }

  function validateField(field: keyof FormState, values: FormState): string {
    const v = (values as any)[field] ?? "";

    if (field === "name") {
      if (!v.trim()) return "Please enter your full name.";
      if (!/^[A-Za-z ]+$/.test(v.trim())) return "Name should only contain letters and spaces.";
      return "";
    }

    if (field === "mobile") {
      if (!v.trim()) return "Please enter your mobile number.";
      if (!/^\d+$/.test(v.trim())) return "Mobile number should contain digits only.";
      if (!isValidMobile(v.trim())) return "Enter a valid 10-digit mobile number (starts with 6/7/8/9).";
      return "";
    }

    if (field === "email") {
      if (!v.trim()) return "Please enter your email address.";
      if (!isValidEmail(v.trim())) return "Please enter a valid email address (example: name@gmail.com).";
      return "";
    }

    if (field === "password") {
      if (!v) return "Please create a password.";
      if (v.length < 8) return "Password must be at least 8 characters long.";
      if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter.";
      if (!/[a-z]/.test(v)) return "Include at least one lowercase letter.";
      if (!/\d/.test(v)) return "Include at least one number.";
      if (!/[@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(v))
        return "Include at least one special character (e.g. @#$%).";
      return "";
    }

    if (field === "confirmPassword") {
      if (!v) return "Please confirm your password.";
      if (v !== values.password) return "Passwords do not match.";
      return "";
    }

    return "";
  }

  // validate all fields before submit
  function validateAll(values: FormState) {
    const result: Record<string, string> = {
      name: validateField("name", values),
      mobile: validateField("mobile", values),
      email: validateField("email", values),
      password: validateField("password", values),
      confirmPassword: validateField("confirmPassword", values),
    };
    if (!terms) result.terms = "You must agree to the Terms & Conditions.";
    setErrors(result);
    // return whether everything is valid
    return Object.values(result).every((x) => x === "");
  }

  // localStorage helpers (simple user store)
  function getStoredUsers(): Array<{ email: string; password: string; name?: string; mobile?: string }> {
    try {
      const raw = localStorage.getItem("sx_users");
      if (!raw) return [];
      return JSON.parse(raw) as any[];
    } catch {
      return [];
    }
  }

  function saveUserToStorage(user: { email: string; password: string; name?: string; mobile?: string }) {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem("sx_users", JSON.stringify(users));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setSuccessHint(null);

    // mark all touched
    setTouched({
      name: true,
      mobile: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateAll(form)) return;

    setLoading(true);
    try {
      // simulate network latency
      const res = await fetch("/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: form.name,
    email: form.email,
    password: form.password,
  }),
});

const data = await res.json();

if (!res.ok) {
  setServerError(
    data.message ||
    "This email is already registered. Please login or use a different email."
  );
  setLoading(false);
  return;
}

      setSuccessHint("Signup successful! Redirecting you to sign in...");
      // small delay so user can see the hint
      setTimeout(() => {
        router.replace("/login");
      }, 900);
    } catch (err: any) {
      setServerError(err?.message || "Signup failed. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  // password strength meter
  const passScore = useMemo(() => {
    const p = form.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p)) score++;
    return score; // 0..5
  }, [form.password]);

  const passStrength = useMemo(() => {
    if (passScore <= 1) return { label: "Very weak", color: "bg-red-500", pct: 20 };
    if (passScore === 2) return { label: "Weak", color: "bg-orange-400", pct: 40 };
    if (passScore === 3) return { label: "Fair", color: "bg-yellow-400", pct: 60 };
    if (passScore === 4) return { label: "Good", color: "bg-emerald-400", pct: 80 };
    return { label: "Strong", color: "bg-green-600", pct: 100 };
  }, [passScore]);

  // preload background image
  useEffect(() => {
    const img = new Image();
    img.src = "/images/login-people.png";
  }, []);

  return (
    <div className="min-h-screen flex bg-[var(--sx-slate-50)]">
      {/* ...left panel (same as before) */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/login-people.png')" }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-white max-w-xl px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Join ScrapXchange Today</h2>
          <p className="text-lg text-white/90 mb-6">
            Become part of India’s largest verified scrap marketplace. Trade safely, quickly, and profitably.
          </p>
        </div>
      </div>

      {/* right form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-14 bg-white">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-[var(--sx-green-700)] text-white text-xl font-bold mb-3">
              SX
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Create your account</h1>
            <p className="text-sm text-slate-500 mt-1">Join the trusted scrap marketplace</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <button className="flex items-center gap-2 justify-center border rounded-lg px-3 py-2 text-sm bg-white hover:shadow">
              <FaGoogle className="text-red-500" /> Google
            </button>
            <button className="flex items-center gap-2 justify-center border rounded-lg px-3 py-2 text-sm bg-white hover:shadow">
              <FaFacebookF className="text-blue-600" /> Facebook
            </button>
            <button className="flex items-center gap-2 justify-center border rounded-lg px-3 py-2 text-sm bg-white hover:shadow">
              <FaApple /> Apple
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <span className="h-px w-full bg-slate-200 absolute left-0" />
            <span className="relative px-3 bg-white text-xs text-slate-400">or register with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field
              label="Full Name"
              type="text"
              icon={<FaUserAlt />}
              value={form.name}
              onChange={(v) => updateField("name", v)}
              onBlur={() => setTouchedField("name")}
              placeholder="John Doe"
              error={errors.name}
            />

            <Field
              label="Mobile Number"
              type="text"
              icon={<FaPhoneAlt />}
              value={form.mobile}
              onChange={(v) => updateField("mobile", v)}
              onBlur={() => setTouchedField("mobile")}
              placeholder="9876543210"
              error={errors.mobile}
            />

            <Field
              label="Email"
              type="email"
              icon={<FaUserAlt />}
              value={form.email}
              onChange={(v) => updateField("email", v)}
              onBlur={() => setTouchedField("email")}
              placeholder="you@company.com"
              error={errors.email}
            />

            <PasswordField
              label="Password"
              value={form.password}
              onChange={(v) => updateField("password", v)}
              show={showPass}
              toggle={() => setShowPass((s) => !s)}
              onBlur={() => setTouchedField("password")}
              error={errors.password}
            />

            <div className="text-xs mt-1 mb-2">
              <div className="flex items-center justify-between">
                <div className="text-slate-600">Password strength</div>
                <div className="text-xs text-slate-500">{passStrength.label}</div>
              </div>
              <div className="w-full h-2 rounded bg-slate-100 mt-2 overflow-hidden">
                <div className={`${passStrength.color} h-full transition-all`} style={{ width: `${passStrength.pct}%` }} />
              </div>
            </div>

            <PasswordField
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={(v) => updateField("confirmPassword", v)}
              show={showConfirm}
              toggle={() => setShowConfirm((s) => !s)}
              onBlur={() => setTouchedField("confirmPassword")}
              error={errors.confirmPassword}
            />

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  setErrors((err) => ({ ...err, terms: "" }));
                }}
                className="w-4 h-4 mt-1"
                aria-label="Agree to terms"
              />
              <div>
                I agree to the{" "}
                <Link href="#" className="text-[var(--sx-green-700)]">
                  Terms & Conditions
                </Link>
                {errors.terms && <div className="text-xs text-red-500 mt-1">{errors.terms}</div>}
              </div>
            </label>

            {serverError && <div className="text-sm text-red-500">{serverError}</div>}
            {successHint && <div className="text-sm text-emerald-600">{successHint}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[var(--sx-green-700)] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[var(--sx-green-800)] transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--sx-green-700)] font-semibold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Field component */
type FieldProps = {
  label: string;
  type: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
};
function Field({ label, type, icon, value, onChange, onBlur, placeholder, error }: FieldProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">{label}</span>
      </div>

      <div className="mt-1 relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full border rounded-md pr-10 pl-3 py-2 text-sm focus:ring-2 focus:ring-[var(--sx-green-700)]
            ${error ? "border-red-300 bg-red-50" : "border-slate-300 bg-white"}`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </label>
  );
}

/* PasswordField component */
type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  toggle: () => void;
  onBlur?: () => void;
  error?: string;
};
function PasswordField({ label, value, onChange, show, toggle, onBlur, error }: PasswordFieldProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">{label}</span>
      </div>

      <div className="mt-1 relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="••••••••"
          className={`w-full border rounded-md pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-[var(--sx-green-700)]
            ${error ? "border-red-300 bg-red-50" : "border-slate-300 bg-white"}`}
        />
        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
        </button>
      </div>

      {!error && label.toLowerCase().startsWith("password") && (
        <p className="text-xs text-slate-500 mt-1">
          Use 8+ characters, including 1 uppercase, 1 lowercase, 1 number and 1 special character (e.g. @ # $ % ^ &amp; *).
        </p>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </label>
  );
}
