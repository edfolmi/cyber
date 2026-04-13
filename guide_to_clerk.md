## Prompt for the agent (copy from here)

**Role:** You are a senior full-stack engineer integrating **Clerk authentication + Clerk Billing (subscriptions)** into an existing application, then provisioning **Azure** infrastructure with **Terraform** and wiring **CI/CD** so changes deploy safely.


### Product behavior to implement (mirror the reference pattern)
1. **Auth**
   - Integrate **Clerk** for sign-in/sign-up.
   - **Next.js App Router (if applicable):** use **`proxy.ts`** at project root (or `src/`) with `clerkMiddleware()` from `@clerk/nextjs/server` — **not** deprecated `authMiddleware`. If the framework version requires `middleware.ts` instead of `proxy.ts`, follow the version’s official Clerk doc and state which file you used.
   - Wrap the app in **`ClerkProvider`** inside `<body>` in `app/layout.tsx` (or equivalent).
   - Header: **`Show`** from `@clerk/nextjs` with `when="signed-out"` → `SignInButton` / `SignUpButton`; `when="signed-in"` → `UserButton`. **Do not** use deprecated `<SignedIn>` / `<SignedOut>` if the installed Clerk major documents `<Show>`.
2. **Subscription gating**
   - **Signed-out:** marketing / paywall copy + sign-in CTA.
   - **Signed-in, no plan:** show **`<PricingTable for="user" />`** (or `organization` if product requires) with `newSubscriptionRedirectUrl` set to the post-checkout landing path.
   - **Signed-in with plan:** unlock premium UI (e.g. main tool). Use **`useAuth().has({ plan: "user:[PLAN_KEY]" })`** (adjust prefix for org plans). Do not put secret keys in `NEXT_PUBLIC_*`.
3. **Stacking / UI gotcha**
   - If pricing lives inside **frosted glass** (`backdrop-filter`), use a **non-blurred** panel for the pricing container **or** raise Clerk drawer z-index via **`ClerkProvider` `appearance.elements`** (`drawerOverlay` / `drawerRoot` / `drawerContent`) so **checkout is never under** local glass layers.
4. **Backend (if API exists)**
   - Optional: protect generation routes; at minimum document that **UI-only gating is not enough** for production and recommend verifying Clerk session JWT or calling Clerk Backend API server-side.
   - CORS: allow only the real frontend origins in production.

### Environment variables (document in README or `.env.example`, never commit secrets)
- **Next.js:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, plus any `NEXT_PUBLIC_*` needed for API base URL.
- **API (if any):** `CLERK_SECRET_KEY` or JWKS-based verification, `OPENAI_API_KEY` or other providers as needed.
- **Azure / CI:** use pipeline secret stores (GitHub Actions secrets, Azure Key Vault references, etc.) — **never** bake secrets into Terraform state in plain text if avoidable; prefer Key Vault + references where the platform supports it.

### 
1. **Clerk dashboard alignment**
   - Document: allowed redirect URLs, production/preview URLs, Billing enabled, plan key `[PLAN_KEY]`, and CORS if API is cross-origin.

### Quality bar
- **Build must pass** (`next build` or equivalent + API tests if present).
- **No secrets** in repo; provide **`.env.example`** only with placeholder names.
- **Idempotent** Terraform; document **how to destroy** non-prod safely.
- End with a **short handoff**: what was created, env vars to set in Azure + Clerk + CI, and first deploy command order.

### Verify before you finish (checklist you must tick in your reply)
- [ ] Clerk middleware/proxy file matches official docs for the project’s Next (or framework) version  
- [ ] `ClerkProvider` wraps client tree correctly  
- [ ] Subscription UI uses **PricingTable** + **`has({ plan: ... })`** pattern  
- [ ] Checkout not obscured by `backdrop-filter` panels  
- [ ] Terraform plan/apply path documented; CI runs plan on PR  
- [ ] Secrets only in CI / Key Vault / dashboard — not in git  

**Constraints:** Minimize unrelated refactors. Match existing code style. If the target repo is not Next.js, adapt the Clerk integration to that stack using current Clerk docs and say what you changed.

---

**Optional one-liner for the human to prepend:**  
“My stack is NextJS and FastAPI. Use Clerk Billing plan key `premium_member`. Prefer Azure Container Apps + ACR + Terraform + GitHub Actions OIDC.”