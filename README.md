# Lawrence Ifeanyi Portfolio

## Run locally

1. Install the project dependencies with `npm install`.
2. Copy `.env.example` to `.env` and replace `ADMIN_PASSWORD` with a long, private password.
3. Run `npm run dev`. The portfolio is served by Vite and the API starts on port 3001.
4. Open `/admin` on the Vite address to sign in and edit the website.

The admin editor manages navigation, hero, about, services, skills, projects, contact details, and uploaded images. Contact form submissions are saved in the admin inbox. Content and messages persist in `server/data/`; uploaded images go in `public/uploads/`.

## Production

Run `npm run build`, then set `ADMIN_PASSWORD` and run `npm start`. The Node server serves the built `dist/` site and the API from the same origin. Use a host with persistent disk storage so edits, contact messages, and uploaded images survive restarts. Keep `.env` private and use HTTPS on a public deployment.
