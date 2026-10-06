# Lawrence Ifeanyi Portfolio

## Run locally

1. Install the project dependencies with `npm install`.
2. Install Python 3.10 or newer, then install the API dependencies with `python -m pip install -r backend/requirements.txt`.
3. Copy `.env.example` to `.env` and replace `ADMIN_PASSWORD` with a long, private password.
4. Run `npm run dev`. The FastAPI API starts on port 8001 and Vite serves the portfolio with API requests proxied to FastAPI. If that port is unavailable, set `API_PORT` first (PowerShell example: `$env:API_PORT='8012'; npm run dev`).
5. Open `/admin` on the Vite address to sign in and edit the website.

The admin editor manages navigation, hero, about, services, skills, projects, contact details, and uploaded images. Contact form submissions are saved in the admin inbox. The FastAPI backend stores content and messages in `backend/portfolio.db`; uploaded images go in `public/uploads/`. The API can also be started by itself with `npm run start:api`.

## Production

Run `npm run build`, then deploy the Vite frontend and FastAPI backend to hosts that can run both services. Set `ADMIN_PASSWORD` for the API and use persistent disk storage for the SQLite database and uploaded images. You can proxy `/api` and `/uploads` through one origin, or set `VITE_API_URL` to the API origin and configure `CORS_ORIGINS` with the frontend origins. Keep `.env` private and use HTTPS on a public deployment.

## Deploy on Vercel

The `/admin` route is rewritten to the Vite app, and the `api/` folder contains the existing Vercel Function endpoints. Those Vercel endpoints remain separate from the FastAPI/SQLite backend. To use FastAPI in production, deploy it as a separate service with persistent storage and set `VITE_API_URL` on the frontend; serverless Vercel Functions do not provide persistent local SQLite storage.

### Vercel frontend + Render FastAPI backend

1. Push this project to GitHub and import it into Vercel as a Vite project. Use `npm run build` as the build command and `dist` as the output directory.
2. Create a Render **Web Service** from the same repository. Set the root directory to the repository root, build command to `python -m pip install -r backend/requirements.txt`, and start command to `python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`.
3. Add a Render **persistent disk** mounted at `/var/data`. Add these Render environment variables:
   - `ADMIN_PASSWORD`: a new, long random password. Do not use the sample value from `.env.example`.
   - `DATABASE_URL`: `sqlite:////var/data/portfolio.db`
   - `UPLOAD_DIR`: `/var/data/uploads`
   - `CORS_ORIGINS`: your exact Vercel production origin, for example `https://your-site.vercel.app` (no trailing slash). Add any custom domain origins as comma-separated values.
4. Wait for Render to deploy, then open `https://your-render-service.onrender.com/health`. It should return `{"status":"ok"}`.
5. In Vercel project settings, add `VITE_API_URL` with the Render service URL, for example `https://your-render-service.onrender.com`, with no trailing slash. Add it for Production (and Preview if you use previews), then redeploy the frontend.
6. Visit the Vercel site's `/admin`, sign in with the Render `ADMIN_PASSWORD`, save a content edit, submit a test contact message, and verify an image upload. The SQLite file and uploads live on the persistent disk, so they remain available across service restarts.

Keep `VITE_API_URL` set in Vercel before building: it is compiled into the frontend bundle. Never put `ADMIN_PASSWORD` in a `VITE_` variable or in Vercel's frontend environment variables. If you previously used a real password in `.env.example`, rotate it before deploying.
