# Snipify Server

Node/Express + MongoDB backend for the Snipify URL shortener. Built to match
the `client/` frontend's `services/api.js` exactly.

## Stack

- Express 4
- MongoDB + Mongoose
- JWT auth (`jsonwebtoken`) with bcrypt-hashed passwords (`bcryptjs`)
- `nanoid` for short codes, `qrcode` for QR generation

## Setup

```bash
cd server
npm install
cp .env.example .env   # then edit MONGO_URI / JWT_SECRET as needed
npm run dev             # nodemon, http://localhost:5000
```

Requires a running MongoDB instance (local `mongod`, Docker, or Atlas —
just point `MONGO_URI` at it).

## Environment variables

| Var | Purpose | Default |
|---|---|---|
| `PORT` | API port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/snipify` |
| `JWT_SECRET` | Secret used to sign JWTs | — (set your own) |
| `JWT_EXPIRE` | Token lifetime | `7d` |
| `CLIENT_URL` | Frontend origin, used for CORS + 404 redirects | `http://localhost:5173` |
| `SHORT_DOMAIN` | Domain shown/used in generated short links | `localhost:5000` |

## API

All JSON responses are `{ success: boolean, ...data }` or
`{ success: false, message, errors? }` on failure.

### Auth — `/api/auth`
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/register` | – | `{ name, email, password }` | `{ token, user }` |
| POST | `/login` | – | `{ email, password }` | `{ token, user }` |
| GET | `/me` | Bearer | – | `{ user }` |

### URLs — `/api/urls`
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET | `/` | Bearer | – | `{ urls: [...] }` |
| POST | `/` | Bearer | `{ originalUrl, customCode?, title?, tags? }` | `{ url }` |
| PATCH | `/:id` | Bearer | `{ title?, tags?, active? }` | `{ url }` |
| DELETE | `/:id` | Bearer | – | `{ id }` |
| POST | `/demo` | – | `{ originalUrl }` | `{ shortUrl, shortCode }` (public homepage demo box) |

### Analytics — `/api/analytics`
| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/:id` | Bearer | `{ analytics }` (clicks, dailyClicks, referrers, devices, countries) |

### Redirect
`GET /:shortCode` (mounted outside `/api`) — 302s to the original URL and
records the click (device from User-Agent, referrer from the `Referer`
header, daily bucket, total count). Unknown/inactive codes redirect to
`${CLIENT_URL}/404`.

## Notes on the analytics data

Country data isn't populated automatically since that needs a GeoIP lookup
service, which isn't wired up here. Every link seeds with empty
referrer/device/country rows and fills in as real clicks happen (device +
referrer are derived from real request headers on every redirect). Swap in
a GeoIP provider in `services/analyticsService.js` if you want country
breakdowns to populate for real.
