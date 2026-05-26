"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm border border-white/30 rounded-md px-3 py-1.5 hover:bg-white/10"
    >
      Sign out
    </button>
  );
}
