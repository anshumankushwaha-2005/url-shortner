# Snipify

A full-stack URL shortener: React (Vite) frontend + Node/Express/MongoDB backend,
with auth, per-link analytics (clicks, referrers, devices, countries), and
QR code generation.

```
url-shortener/
├── client/     # React frontend (Vite) — see client/README.md
├── server/     # Node/Express + MongoDB API — see server/README.md
```

## Quick start

```bash
# 1. Install everything
npm run install:all

# 2. Configure the server
cp server/.env.example server/.env
# edit server/.env — at minimum set MONGO_URI and JWT_SECRET

# 3. Configure the client (optional — defaults already match the server)
cp client/.env.example client/.env

# 4. Run both together
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000/api
- Health check: http://localhost:5000/health

You'll need a MongoDB instance running (local `mongod`, Docker
`docker run -p 27017:27017 mongo`, or a free MongoDB Atlas cluster) and its
connection string in `server/.env` as `MONGO_URI`.

## How it fits together

- The client's `src/services/api.js` calls `/api/auth/*`, `/api/urls/*`, and
  `/api/analytics/*` — all implemented in `server/routes`.
- Vite's dev server proxies `/api` to `http://localhost:5000` (see
  `client/vite.config.js`), so the client doesn't need CORS in dev even
  though the server has it configured for production too.
- Short links themselves (`GET /:shortCode`) are served directly by the
  API (outside `/api`) and 302-redirect to the original URL while
  recording a click.

## Auth flow

JWT-based. `POST /api/auth/register` and `/login` return a `token` that the
client stores in `localStorage` (`snipify_token`) and attaches as
`Authorization: Bearer <token>` on every subsequent request via an axios
interceptor. `GET /api/auth/me` restores the session on page reload.

See `server/README.md` for the full API reference and environment
variables.
