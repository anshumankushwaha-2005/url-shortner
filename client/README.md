# Snipify — client

React (Vite) frontend for the Snipify URL shortener, matching the project's `client/` folder layout.

## Setup

```
cd client
npm install
cp .env.example .env
npm run dev
```

The dev server proxies `/api/*` to `http://localhost:5000` (see `vite.config.js`) — point this at your `server/` app.

## Expected backend contract

| Method | Route                | Purpose                          |
|--------|-----------------------|-----------------------------------|
| POST   | /api/auth/register     | `{ name, email, password }` → `{ token, user }` |
| POST   | /api/auth/login        | `{ email, password }` → `{ token, user }` |
| GET    | /api/auth/me           | Bearer token → `{ user }` |
| GET    | /api/urls              | Bearer token → `{ urls: [...] }` |
| POST   | /api/urls              | `{ originalUrl, customCode? }` → `{ url }` |
| DELETE | /api/urls/:id          | Deletes a link |
| GET    | /api/analytics/:id     | → `{ analytics: { clicks, lastClick, dailyClicks, referrers, devices, countries, shortCode } }` |
| POST   | /api/urls/demo         | Public, no auth — used by the homepage demo box |

`url` / `analytics` objects are expected to match the shapes consumed in `src/components/UrlCard.jsx` and `src/pages/Analytics.jsx`.

## Structure

Matches the tree you shared — `components/`, `pages/`, `context/`, `services/`, `hooks/`, `utils/` — with a few additions needed to make it a working app:

- `components/UrlList.jsx`, `components/AnalyticsCard.jsx`, `components/Loader.jsx`, `pages/NotFound.jsx` — referenced in your tree but not in the uploaded design, added here.
- `services/api.js` — axios instance + auth token interceptor, talking to the routes above.
- Routing uses `react-router-dom` (`/`, `/login`, `/register`, `/dashboard`, `/analytics`) instead of the in-memory page state from the design mockup, so it's ready for real deployment (shareable URLs, browser back/forward, protected routes).
- `AuthContext` now calls the API and persists the session token in `localStorage` instead of using mock data.

Visual design (dark theme, gradient accents, Outfit/Inter/JetBrains Mono type) is unchanged from the design you uploaded.
