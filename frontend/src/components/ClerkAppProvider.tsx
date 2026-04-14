"use client";

import { ClerkProvider } from "@clerk/react";
import { clerkReadableVariables } from "@/lib/clerkReadableTheme";

export default function ClerkAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          ...clerkReadableVariables,
          colorDanger: "#f87171",
          colorSuccess: "#4ade80",
          borderRadius: "0.25rem",
          fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace',
          fontFamilyButtons: 'ui-monospace, "Cascadia Code", Consolas, monospace',
        },
        elements: {
          drawerOverlay: { zIndex: 99999, backgroundColor: "rgba(0,0,0,0.85)" },
          drawerRoot: { zIndex: 99999 },
          drawerContent: { zIndex: 100000, border: "1px solid #404040" },
          card: {
            border: "1px solid #404040",
            boxShadow: "none",
            backgroundColor: "#0c0c0c",
          },
          headerTitle: {
            color: "#ffffff",
            fontSize: "1.125rem",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          },
          headerSubtitle: {
            color: "#d4d4d4",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          },
          formFieldLabel: {
            color: "#e8e8e8",
            fontSize: "0.8125rem",
            fontWeight: "600",
          },
          formFieldInput: {
            color: "#ffffff",
            fontSize: "0.9375rem",
            borderColor: "#404040",
          },
          formFieldHintText: {
            color: "#b8b8b8",
            fontSize: "0.8125rem",
            lineHeight: "1.45",
          },
          formFieldErrorText: {
            color: "#fca5a5",
            fontSize: "0.8125rem",
          },
          footer: {
            color: "#c8c8c8",
          },
          footerAction: {
            color: "#d4d4d4",
          },
          footerActionLink: {
            color: "#ffffff",
            fontWeight: "700",
          },
          identityPreviewText: {
            color: "#ffffff",
            fontSize: "0.9375rem",
          },
          dividerText: {
            color: "#a8a8a8",
            fontSize: "0.75rem",
            fontWeight: "600",
          },
          alternativeMethodsBlockButton: {
            color: "#f0f0f0",
            borderColor: "#404040",
            fontSize: "0.875rem",
            fontWeight: "600",
          },
          socialButtonsBlockButton: {
            color: "#ffffff",
            border: "1px solid #404040",
            backgroundColor: "#141414",
          },
          socialButtonsBlockButtonText: {
            color: "#f5f5f5",
            fontSize: "0.875rem",
            fontWeight: "600",
          },
          formButtonPrimary: {
            backgroundColor: "#ffffff",
            color: "#000000",
            fontFamily: 'ui-monospace, monospace',
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontSize: "0.8125rem",
            fontWeight: "700",
          },
          formButtonSecondary: {
            color: "#ffffff",
            border: "1px solid #525252",
            fontSize: "0.8125rem",
            fontWeight: "600",
          },
          otpCodeFieldInput: {
            color: "#ffffff",
            borderColor: "#404040",
            fontSize: "1rem",
            fontWeight: "600",
          },
          userButtonPopoverActionButton: {
            color: "#ffffff",
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
