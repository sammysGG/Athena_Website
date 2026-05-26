"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/portal";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("You must accept the terms and conditions to continue.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-line rounded-lg p-6">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="w-full border border-line rounded-md px-3 py-2 outline-none focus:border-govblue"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full border border-line rounded-md px-3 py-2 outline-none focus:border-govblue"
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <span>
          I understand the information on this system is fictional, and I agree to the{" "}
          <span className="font-medium text-ink">Athena Strikes terms and conditions</span> and
          acceptable-use policy.
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !agreed}
        className="w-full bg-govblue text-white py-2.5 rounded-md font-medium hover:bg-govblue-dark disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
