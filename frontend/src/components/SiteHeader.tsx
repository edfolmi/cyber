"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/react";

export default function SiteHeader() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="h-9 w-28 animate-pulse bg-elevated" aria-hidden />
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {!isSignedIn ? (
        <>
          <SignInButton mode="modal">
            <button
              type="button"
              className="border border-line-strong bg-transparent px-3 py-2 font-robot text-[0.7rem] font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink-muted hover:text-white"
            >
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              type="button"
              className="border border-ink bg-ink px-3 py-2 font-robot text-[0.7rem] font-bold uppercase tracking-wider text-canvas transition-colors hover:bg-white"
            >
              Register
            </button>
          </SignUpButton>
        </>
      ) : (
        <div className="border border-line bg-elevated px-0.5 py-0.5">
          <UserButton />
        </div>
      )}
    </div>
  );
}
