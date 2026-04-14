import { clerkReadableVariables } from "@/lib/clerkReadableTheme";

/**
 * Dark billing UI. Primary CTA is white with black label (colorPrimaryForeground).
 * "Billed annually" and similar use muted foreground; forced to white for contrast on dark.
 */
export const pricingTableAppearance = {
  variables: {
    ...clerkReadableVariables,
    colorPrimary: "#ffffff",
    colorPrimaryForeground: "#000000",
    colorTextOnPrimaryBackground: "#000000",
    colorMutedForeground: "#ffffff",
    colorTextSecondary: "#ffffff",
    colorDanger: "#f87171",
    colorSuccess: "#4ade80",
    colorShimmer: "#1f1f1f",
    borderRadius: "0.25rem",
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  },
  elements: {
    rootBox: {
      width: "100%",
    },
    card: {
      backgroundColor: "#0c0c0c",
      border: "1px solid #404040",
      boxShadow: "none",
    },
    pricingTable: {
      backgroundColor: "#0a0a0a",
    },
    pricingTableCard: {
      backgroundColor: "#0c0c0c",
      border: "1px solid #404040",
    },
    pricingTableCardHeader: {
      backgroundColor: "#0c0c0c",
    },
    pricingTableCardTitle: {
      color: "#ffffff",
      fontSize: "1.0625rem",
      fontWeight: "700",
      letterSpacing: "-0.02em",
    },
    pricingTableCardDescription: {
      color: "#d8d8d8",
      fontSize: "0.875rem",
      lineHeight: "1.5",
    },
    pricingTableCardFee: {
      color: "#ffffff",
      fontSize: "1.375rem",
      fontWeight: "700",
    },
    pricingTableCardFeePeriod: {
      color: "#c0c0c0",
      fontSize: "0.8125rem",
    },
    pricingTableCardFeaturesListItem: {
      color: "#ececec",
      fontSize: "0.875rem",
      lineHeight: "1.55",
    },
    formButtonPrimary: {
      backgroundColor: "#ffffff",
      color: "#000000",
      fontFamily: '"Space Mono", monospace',
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      fontSize: "0.8125rem",
      fontWeight: "700",
      boxShadow: "none",
    },
    formButtonSecondary: {
      color: "#ffffff",
      border: "1px solid #525252",
      backgroundColor: "transparent",
      fontSize: "0.8125rem",
      fontWeight: "600",
    },
    badge: {
      backgroundColor: "#1f1f1f",
      color: "#ffffff",
      border: "1px solid #525252",
      fontSize: "0.6875rem",
      fontWeight: "700",
    },
  },
} as const;
