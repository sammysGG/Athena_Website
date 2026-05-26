import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SignInForm from "@/app/components/auth/SignInForm";

export const metadata: Metadata = { title: "Staff sign-in" };

export default function SignInPage() {
  return (
    <div className="container py-12 max-w-md">
      <div className="flex items-center gap-3 mb-5">
        <Image src="/img/coat-of-arms.png" alt="" width={40} height={40} />
        <div>
          <div className="font-semibold">Staff sign-in</div>
          <div className="text-xs text-muted uppercase tracking-wide">
            Government Office — Siseveeb
          </div>
        </div>
      </div>

      {/* Warning / disclaimer banner — server-rendered so it always shows. */}
      <div className="border border-amber-300 bg-amber-50 text-amber-900 rounded-md p-4 mb-5 text-sm leading-relaxed">
        <p className="font-semibold mb-1">⚠ Exercise system — restricted access</p>
        <p>
          All names, accounts and information on this system are{" "}
          <strong>purely fictional</strong> and form part of a training exercise. This is not a
          real government system. Access is restricted to authorised exercise participants only;
          activity may be monitored and recorded. By signing in you agree to the{" "}
          <strong>Athena Strikes</strong> terms and conditions.
        </p>
      </div>

      <Suspense fallback={<div className="border border-line rounded-lg p-6 text-muted">Loading…</div>}>
        <SignInForm />
      </Suspense>

      <p className="text-center text-sm text-muted mt-6">
        <Link href="/" className="hover:underline">
          ← Back to the website
        </Link>
      </p>
    </div>
  );
}
