# Muse — AI Writing Platform

A production-quality SaaS application for generating stories, poems, and jokes using OpenAI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express.js, MongoDB Atlas, Mongoose |
| Auth | JWT (access + refresh tokens), bcrypt |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/        # DB connection, env validation
│       ├── controllers/   # HTTP request handlers
│       ├── middlewares/   # Auth, validation, rate limiting, error handling
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routers
│       ├── services/      # Business logic (OpenAI, auth, generation, user)
│       ├── utils/         # AppError, JWT helpers, API response helpers
│       └── validators/    # express-validator rule sets
└── frontend/
    └── src/
        ├── api/           # Axios API modules per domain
        ├── components/    # Reusable UI + layout components
        ├── hooks/         # useGeneration, useDownload, useCopyToClipboard
        ├── lib/           # Axios instance, Zod schemas
        ├── pages/         # Route-level page components
        └── store/         # AuthContext
```

## Local Development

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- OpenAI API key

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_BASE_URL if not using the Vite proxy
npm install
npm run dev
```

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout |

### Generations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/generations` | Generate content |
| GET | `/api/v1/generations/history` | Paginated history |
| GET | `/api/v1/generations/saved` | Saved content |
| PATCH | `/api/v1/generations/:id/save` | Toggle save |
| DELETE | `/api/v1/generations/:id` | Delete |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get profile |
| PATCH | `/api/v1/users/me` | Update profile |
| PATCH | `/api/v1/users/me/password` | Change password |
| GET | `/api/v1/users/me/stats` | Generation stats |

## Deployment

### Backend → Render
1. Connect your GitHub repo
2. Set environment variables from `.env.example`
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend → Vercel
1. Connect your GitHub repo, set root to `frontend/`
2. Set `VITE_API_BASE_URL` to your Render backend URL
3. Deploy

## Security
- Helmet for HTTP security headers
- Rate limiting: 10 req/15min on auth, 10 req/min on generation
- JWT access tokens (15m) + refresh tokens (7d) with rotation
- Refresh tokens stored as httpOnly cookies
- bcrypt with 12 salt rounds
- Input validation on all endpoints
- MongoDB TTL index auto-expires refresh tokens
