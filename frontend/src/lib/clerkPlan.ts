import type { useAuth } from "@clerk/react";

type HasFn = ReturnType<typeof useAuth>["has"];

/**
 * Subscription gate: `has({ plan })` must use the plan **slug** from Clerk
 * (Dashboard → Billing → Plans → open the plan → slug), not the display name "Premium".
 *
 * - Set `NEXT_PUBLIC_CLERK_PLAN_KEY` to that slug, or several comma-separated slugs.
 * - Each slug is checked as-is and as `user:<slug>` / `org:<slug>` unless it already contains `:`.
 * - If unset, tries `premium` and `premium_member` (common when the plan is named Premium).
 * - Optionally set `NEXT_PUBLIC_CLERK_FEATURE_KEY` if you gate on a Feature instead/as well.
 */
function planVariants(slug: string): string[] {
  const s = slug.trim();
  if (!s) return [];
  if (s.includes(":")) {
    return [s];
  }
  return [s, `user:${s}`, `org:${s}`];
}

export function userHasPaidAccess(has: HasFn): boolean {
  const fromEnv = process.env.NEXT_PUBLIC_CLERK_PLAN_KEY?.trim();
  const slugs = (fromEnv && fromEnv.length > 0 ? fromEnv : "premium,premium_member")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const slug of slugs) {
    for (const plan of planVariants(slug)) {
      if (has({ plan })) return true;
    }
  }

  const feature = process.env.NEXT_PUBLIC_CLERK_FEATURE_KEY?.trim();
  if (feature && has({ feature })) return true;

  return false;
}
