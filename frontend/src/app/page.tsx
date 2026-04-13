"use client";

import { useEffect, useState } from "react";
import { PricingTable, SignInButton, SignUpButton, useAuth } from "@clerk/react";
import { AnalysisResponse } from "@/types/security";
import { userHasPaidAccess } from "@/lib/clerkPlan";
import CodeInput from "@/components/CodeInput";
import AnalysisResults from "@/components/AnalysisResults";
import { pricingTableAppearance } from "@/lib/clerkPricingAppearance";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  window.location?.hostname === "localhost"
    ? "http://localhost:8000"
    : "");

function checkoutReturnUrl(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "") ?? "";
  if (env) return `${env}/`;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/`;
  }
  return "/";
}

function devBillingBypass(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_BYPASS_CLERK_BILLING === "true"
  );
}

export default function Home() {
  const { isLoaded, isSignedIn, has, getToken } = useAuth();
  const [codeContent, setCodeContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasAccess = devBillingBypass() || userHasPaidAccess(has);
  const toolLocked = isSignedIn && !hasAccess;

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void getToken({ skipCache: true }).catch(() => {});
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasAccess) return;
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) void getToken({ skipCache: true }).catch(() => {});
    };
    const timeouts = [400, 1500, 4000, 8000].map((ms) => setTimeout(refresh, ms));
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [isLoaded, isSignedIn, hasAccess, getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void getToken({ skipCache: true }).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [isLoaded, isSignedIn, getToken]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".py")) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCodeContent(content);
        setAnalysisResults(null);
        setError(null);
      };
      reader.readAsText(file);
    } else {
      alert("Please choose a Python file ending in .py");
    }
  };

  const handleAnalyzeCode = async () => {
    if (toolLocked) return;
    if (!codeContent) {
      alert("Add a file first. We need something to read.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results: AnalysisResponse = await response.json();
      setAnalysisResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-6">
        <div
          className="h-8 w-8 border-2 border-line border-t-ink animate-spin"
          style={{ animationDuration: "0.9s" }}
          aria-hidden
        />
        <p className="font-robot text-center text-xs font-bold uppercase tracking-[0.3em] text-ink-muted">
          Initializing session
        </p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="px-6 pb-20 pt-10 sm:pt-14 lg:pt-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
          <div>
            <p className="font-robot text-[0.6rem] font-bold uppercase tracking-[0.35em] text-danger">
              Pre-auth surface
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.65rem]">
              Know what your Python is willing to admit, before a stranger does.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Read-through is a small, serious workspace: one file, one pass, findings written in
              language you can paste into a ticket or a stand-up. No theatrics, just a clear read
              of where the sharp edges are.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
              Sign in when you’re ready. If your workspace uses a subscription, you’ll choose a
              plan next, then you’re back here at the same desk.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="border border-line-strong px-5 py-2.5 font-robot text-[0.65rem] font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink-muted"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="border border-ink bg-ink px-5 py-2.5 font-robot text-[0.65rem] font-bold uppercase tracking-wider text-canvas transition-colors hover:bg-white"
                >
                  Create account
                </button>
              </SignUpButton>
            </div>
          </div>

          <aside className="border border-line bg-surface p-6 sm:p-7">
            <p className="font-robot text-[0.6rem] font-bold uppercase tracking-[0.25em] text-success">
              System note
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              We wanted something that felt like a colleague left notes in the margin, not a robot
              shouting severities. The copy stays human, the chrome stays cold.
            </p>
            <div className="mt-6 border border-dashed border-line px-3 py-2 font-mono text-[10px] leading-relaxed text-ink-muted">
              <span className="text-danger">!</span> AUTH REQUIRED · SESSION TERMINATES ON BROWSER
              CLOSE UNLESS PERSISTED BY IDP
            </div>
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-2xl border-l-2 border-ink pl-4">
          <p className="font-robot text-[0.6rem] font-bold uppercase tracking-[0.3em] text-ink-muted">
            Operator console
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Review desk
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
            Same room as always: source on one side, the memo on the other. When you’re
            subscribed, both sides listen to each other.
          </p>
        </header>

        {toolLocked ? (
          <section className="mb-8 border border-danger/35 bg-danger-dim p-5 sm:p-6">
            <h2 className="font-robot text-xs font-bold uppercase tracking-[0.2em] text-danger">
              Access gate · subscription required
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink sm:text-base">
              The panels below are the live product. Ingest and scan stay disabled until your plan
              is active. Complete checkout, you’ll return to this route automatically.
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              Already subscribed?{" "}
              <button
                type="button"
                className="font-semibold text-ink underline decoration-white/30 underline-offset-4 hover:decoration-white"
                onClick={() => window.location.reload()}
              >
                Hard refresh
              </button>
            </p>
            <div className="clerk-auth-surface mt-5 max-w-4xl overflow-hidden rounded-lg border border-line p-6 sm:p-8">
              <p className="mb-4 font-robot text-[0.6rem] font-bold uppercase tracking-[0.25em] text-ink">
                Subscription catalog
              </p>
              <div className="clerk-pricing-host rounded-md border border-line bg-surface-solid/80 p-4 sm:p-5">
                <PricingTable
                  for="user"
                  newSubscriptionRedirectUrl={checkoutReturnUrl()}
                  appearance={pricingTableAppearance}
                  checkoutProps={{ appearance: pricingTableAppearance }}
                />
              </div>
            </div>
          </section>
        ) : null}

        <div
          className={
            toolLocked
              ? "grid min-h-0 gap-6 opacity-40 transition-opacity lg:grid-cols-2 lg:gap-8"
              : "grid min-h-0 gap-6 lg:grid-cols-2 lg:gap-8"
          }
          aria-disabled={toolLocked}
        >
          <div className="min-h-[min(400px,42vh)] lg:min-h-[min(520px,55vh)]">
            <CodeInput
              codeContent={codeContent}
              fileName={fileName}
              onFileUpload={handleFileUpload}
              onAnalyzeCode={handleAnalyzeCode}
              isAnalyzing={isAnalyzing}
              toolLocked={toolLocked}
            />
          </div>
          <div className="min-h-[min(400px,42vh)] lg:min-h-[min(520px,55vh)]">
            <AnalysisResults
              analysisResults={analysisResults}
              isAnalyzing={isAnalyzing}
              error={error}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
