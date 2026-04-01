"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

type Stage = "enter-email" | "verify-otp" | "reset-password" | "done";
const RESEND_SECONDS = 60; // <-- single source of truth: 60 seconds

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState<Stage>("enter-email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // resend timer state (seconds)
  const [resendSeconds, setResendSeconds] = useState<number>(0);

  // Reset password states
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  // helper validators
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const strongPasswordRe =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  // password strength meter score
  const passScore = useMemo(() => {
    const p = newPass || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p)) score++;
    return score; // 0..5
  }, [newPass]);

  const passStrength = useMemo(() => {
    if (passScore <= 1) return { label: "Very weak", color: "bg-red-500", pct: 20 };
    if (passScore === 2) return { label: "Weak", color: "bg-orange-400", pct: 40 };
    if (passScore === 3) return { label: "Fair", color: "bg-yellow-400", pct: 60 };
    if (passScore === 4) return { label: "Good", color: "bg-emerald-400", pct: 80 };
    return { label: "Strong", color: "bg-green-600", pct: 100 };
  }, [passScore]);

  // OTP timer countdown side effect
  useEffect(() => {
    let t: number | undefined;
    if (resendSeconds > 0) {
      t = window.setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [resendSeconds]);

  // helper to generate a 6-digit OTP (for demo)
  function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async function handleSendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setServerError(null);
    setOtpError(null);

    if (!email.trim()) {
      setServerError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setServerError("Please enter a valid email address (example: name@gmail.com).");
      return;
    }

    setSending(true);
    try {
      // Simulate API call: send OTP to email
      // Replace below with your API call:
      // const res = await fetch("/api/auth/send-otp", { method: "POST", body: JSON.stringify({email}) })
      // const data = await res.json()

      await new Promise((r) => setTimeout(r, 900));

      // Demo: create OTP locally
      const code = generateOtp();
      setGeneratedOtp(code);
      console.info("DEBUG OTP (remove in production):", code);

      setStage("verify-otp");
      setResendSeconds(RESEND_SECONDS); // 60s cooldown before resend
      // show success hint to user
      setServerError(null);
    } catch (err: any) {
      setServerError(err?.message || "Failed to send OTP. Try again later.");
    } finally {
      setSending(false);
    }
  }

  async function handleVerifyOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setOtpError(null);
    setServerError(null);

    if (!otp.trim()) {
      setOtpError("Enter the 6-digit code sent to your email.");
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError("OTP must be 6 digits.");
      return;
    }

    setVerifying(true);
    try {
      await new Promise((r) => setTimeout(r, 700));

      // Demo verification: compare with generatedOtp
      if (generatedOtp && otp.trim() === generatedOtp) {
        setStage("reset-password");
        setOtpError(null);
        setServerError(null);
      } else {
        setOtpError("Invalid code. Please check and re-enter the 6-digit code.");
      }
    } catch (err: any) {
      setServerError(err?.message || "OTP verification failed. Try again.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setServerError(null);
    setOtpError(null);
    if (resendSeconds > 0) return;
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const code = generateOtp();
      setGeneratedOtp(code);
      console.info("DEBUG OTP (resend):", code);
      setResendSeconds(RESEND_SECONDS); // <-- changed to 60 seconds here
    } catch (err: any) {
      setServerError("Failed to resend OTP. Try again.");
    } finally {
      setSending(false);
    }
  }

  function validateResetPasswords() {
    if (!newPass) return "Please enter a new password.";
    if (newPass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(newPass)) return "Include at least one uppercase letter.";
    if (!/[a-z]/.test(newPass)) return "Include at least one lowercase letter.";
    if (!/\d/.test(newPass)) return "Include at least one number.";
    if (!/[@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(newPass))
      return "Include at least one special character (e.g. @#$%).";
    if (!strongPasswordRe.test(newPass))
      return "Password must include uppercase, lowercase, number and special character.";
    if (!confirmPass) return "Please confirm your password.";
    if (newPass !== confirmPass) return "Passwords do not match. Please enter the same password.";
    return null;
  }

  async function handleResetPassword(e?: React.FormEvent) {
    e?.preventDefault();
    setPassError(null);
    setServerError(null);

    const v = validateResetPasswords();
    if (v) {
      setPassError(v);
      return;
    }

    setResetting(true);
    try {
      // Simulate API call to update password
      // Replace with real call:
      // const res = await fetch("/api/auth/reset", { method: "POST", body: JSON.stringify({email, newPass, otp}) })
      // const data = await res.json()

      await new Promise((r) => setTimeout(r, 900));

      // demo success
      setStage("done");
      setServerError(null);
    } catch (err: any) {
      setServerError(err?.message || "Failed to reset password. Try again.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--sx-slate-50)]">
      {/* Left image (hidden on small screens) */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/login-people.png')" }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-white max-w-xl px-10 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Reset your password</h2>
          <p className="text-lg text-white/90 mb-6">
            Enter your registered email to receive a secure 6-digit code. Then set a new password.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">Secure Flow</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">Fast</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">Trusted</span>
          </div>
        </div>
      </div>

      {/* Right card */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-14">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-[var(--sx-green-700)] text-white text-xl font-bold mb-3">
              SX
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              {stage === "enter-email" && "Forgot password"}
              {stage === "verify-otp" && "Verify code"}
              {stage === "reset-password" && "Set a new password"}
              {stage === "done" && "Password changed"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {stage === "enter-email" && "We will send a 6-digit code to your registered email."}
              {stage === "verify-otp" && `Enter the code sent to ${email}`}
              {stage === "reset-password" && "Create a secure password for your account."}
              {stage === "done" && "Your password was updated successfully. Please sign in."}
            </p>
          </div>

          {stage === "enter-email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-600">Email</span>
                <div className="mt-1 relative">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@company.com"
                    className="w-full border rounded-md pr-10 pl-3 py-2 text-sm focus:ring-2 focus:ring-[var(--sx-green-700)]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaEnvelope />
                  </span>
                </div>
              </label>

              {serverError && <div className="text-sm text-red-500">{serverError}</div>}

              <button
                type="submit"
                disabled={sending}
                className="w-full mt-2 bg-[var(--sx-green-700)] hover:bg-[var(--sx-green-800)] text-white px-4 py-3 rounded-lg font-semibold transition"
              >
                {sending ? "Sending..." : "Send code"}
              </button>

              <div className="text-center text-sm mt-3">
                <Link href="/login" className="text-[var(--sx-green-700)] hover:underline">
                  Back to login
                </Link>
              </div>
            </form>
          )}

          {stage === "verify-otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-600">Enter 6-digit code</span>
                <div className="mt-1">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    pattern="\d{6}"
                    placeholder="123456"
                    className="w-full border rounded-md pr-10 pl-3 py-2 text-sm focus:ring-2 focus:ring-[var(--sx-green-700)]"
                  />
                </div>
              </label>

              {otpError && <div className="text-sm text-red-500">{otpError}</div>}
              {serverError && <div className="text-sm text-red-500">{serverError}</div>}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={verifying}
                  className="flex-1 bg-[var(--sx-green-700)] hover:bg-[var(--sx-green-800)] text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  {verifying ? "Verifying..." : "Verify"}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendSeconds > 0 || sending}
                  className={`px-4 py-2 rounded-lg border ${
                    resendSeconds > 0 ? "text-slate-400 border-slate-200" : "text-[var(--sx-green-700)] border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend"}
                </button>
              </div>

              <div className="text-center text-sm mt-3">
                <button
                  type="button"
                  className="text-slate-600 hover:underline"
                  onClick={() => {
                    setStage("enter-email");
                    setOtp("");
                    setGeneratedOtp(null);
                    setServerError(null);
                  }}
                >
                  Use different email
                </button>
              </div>
            </form>
          )}

          {stage === "reset-password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-600">New password</span>
                <div className="mt-1 relative">
                  <input
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Create a strong password"
                    type={showNew ? "text" : "password"}
                    className="w-full border rounded-md pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-[var(--sx-green-700)]"
                  />
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                  </button>
                </div>
              </label>

              <div className="text-xs mt-1 mb-2">
                <div className="flex items-center justify-between">
                  <div className="text-slate-600">Password strength</div>
                  <div className="text-xs text-slate-500">{passStrength.label}</div>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 mt-2 overflow-hidden">
                  <div
                    className={`${passStrength.color} h-full transition-all`}
                    style={{ width: `${passStrength.pct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Use 8+ characters, including uppercase, lowercase, number & special character.
                </p>
              </div>

              <label className="block">
                <span className="text-sm text-slate-600">Confirm password</span>
                <div className="mt-1 relative">
                  <input
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-enter password"
                    type={showConfirm ? "text" : "password"}
                    className="w-full border rounded-md pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-[var(--sx-green-700)]"
                  />
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                  </button>
                </div>
              </label>

              {passError && <div className="text-sm text-red-500">{passError}</div>}
              {serverError && <div className="text-sm text-red-500">{serverError}</div>}

              <button
                type="submit"
                disabled={resetting}
                className="w-full mt-2 bg-[var(--sx-green-700)] hover:bg-[var(--sx-green-800)] text-white px-4 py-3 rounded-lg font-semibold transition"
              >
                {resetting ? "Updating..." : "Update password"}
              </button>
            </form>
          )}

          {stage === "done" && (
            <div className="text-center space-y-4">
              <div className="text-emerald-600 text-4xl">
                <FaCheckCircle />
              </div>
              <div className="text-lg font-medium">Password updated</div>
              <p className="text-sm text-slate-600">You can now sign in with your new password.</p>

              <div className="mt-4">
                <Link href="/login" className="inline-block bg-[var(--sx-green-700)] text-white px-6 py-2 rounded-lg">
                  Go to Sign in
                </Link>
              </div>
            </div>
          )}

          {/* bottom note */}
          {stage !== "done" && (
            <div className="mt-6 text-center text-sm">
              Remembered your password?{" "}
              <Link href="/login" className="text-[var(--sx-green-700)] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
