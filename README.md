# Cyber security code review app

Python security analysis for uploaded `.py` files. The API runs static checks with Semgrep, then an OpenAI agent turns results into a clear report.

**Stack**

- **FastAPI** serves the API and the built frontend from one container.
- **Next.js** UI is exported as static files, same origin as the API in production.
- **Clerk** handles sign in and subscription billing, gated access to the analyzer.
- **Azure** via **Terraform**, Container Apps, ACR, remote state, **GitHub Actions** with OIDC to deploy.

**Repo layout**

`backend/` FastAPI app, `frontend/` Next app, `terraform/azure/` infra, `.github/workflows/` CI deploy.

**Local**

Run the API (see `backend/`), run `npm run dev` in `frontend/`. Copy `frontend/.env.example` to `.env.local` for Clerk keys. Same machine usually means you can leave `NEXT_PUBLIC_API_URL` empty and hit `http://localhost:8000` in dev.

![Course image](assets/cyber.png)
