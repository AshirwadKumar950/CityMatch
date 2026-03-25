# CityMatch

![Status](https://img.shields.io/badge/status-active-success)
![Frontend](https://img.shields.io/badge/frontend-React%2019-blue)
![Backend](https://img.shields.io/badge/backend-Express%205-green)
![Database](https://img.shields.io/badge/database-PostgreSQL%20%2B%20PostGIS-336791)

CityMatch is a full-stack relocation assistant that helps users discover better neighborhoods by combining map interaction, facility preferences, and geospatial search.

The app lets users:
- drop a base pin on map,
- select priority facilities,
- choose distance/time constraints,
- view matching places sorted by nearest distance.

## Table of Contents

- [Why CityMatch](#why-citymatch)
- [Feature Highlights](#feature-highlights)
- [Architecture](#architecture)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [API Contract](#api-contract)
- [Environment Variables](#environment-variables)
- [Quick Start (Local)](#quick-start-local)
- [Scripts](#scripts)
- [Database Notes](#database-notes)
- [JWT Auth Notes](#jwt-auth-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

## Why CityMatch

Finding a home is not only about city name. Daily quality of life depends on nearby essentials like hospitals, schools, gyms, parks, and transit.

CityMatch turns that decision into a data-backed map workflow.

## Feature Highlights

### Frontend
- Responsive React app with route-based pages
- Interactive Leaflet map with style switcher
- Pin-drop location selection with live coordinate sync
- Facility multi-select and distance mode controls
- Result list plus map marker visualization
- Login/signup UI with local token persistence

### Backend
- Express API with modular routes/controllers/models
- JWT auth issue plus verify flow
- Password hashing with bcrypt
- PostgreSQL query abstraction
- Geospatial place search using PostGIS functions
- DB bootstrapping for `citymatch_users`

## Architecture

```mermaid
flowchart LR
  U[User] --> FE[React Frontend]
  FE -->|HTTP JSON| BE[Express Backend]
  BE -->|SQL + PostGIS| DB[(PostgreSQL / Supabase)]
  DB --> BE
  BE --> FE
  FE --> UI[Map + Results + Profile]
```

### Auth Request Flow

```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend
  participant B as Backend

  U->>F: Submit login/signup form
  F->>B: POST /api/users/login or /register
  B->>B: Validate, hash/compare password
  B->>B: Sign JWT (7d)
  B-->>F: token + user
  F->>F: Store token in localStorage
```

## Monorepo Structure

```text
CityMatch/
  backend/
    .env
    package.json
    src/
      app.js
      server.js
      config/
        db.js
      controllers/
        userController.js
        placeController.js
      middleware/
        authMiddleware.js
      models/
        userModel.js
      routes/
        userRoutes.js
        placeRoutes.js
      utils/
        logger.js
  public/
  src/
    components/
      MapComponent.jsx
      InfoForm.jsx
      DistanceSelector.jsx
      navbar.jsx
      footer.jsx
      slider.jsx
    pages/
      MapPage.jsx
      login.jsx
      signup.jsx
      userprofile.jsx
      about.jsx
    App.jsx
    main.jsx
```

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Leaflet |
| Backend | Node.js, Express 5, dotenv, CORS |
| Auth | jsonwebtoken, bcryptjs |
| Database | PostgreSQL (`pg`) on Supabase, PostGIS functions |

## API Contract

Base backend URL (local): `http://localhost:5000`

### Health
- `GET /`

### User APIs
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile` (protected)

### Place APIs
- `POST /api/places/search`

Example request for place search:

```json
{
  "latitude": 28.6139,
  "longitude": 77.209,
  "facilities": ["Hospital", "School", "Park"],
  "distance": {
    "value": 20,
    "unit": "min",
    "travelMode": "walking"
  },
  "limit": 20
}
```

Expected response shape:

```json
{
  "count": 2,
  "maxDistanceKm": 1.66,
  "results": [
    {
      "id": 10,
      "name": "Central Hospital",
      "latitude": "28.61",
      "longitude": "77.21",
      "type": "hospital",
      "distance_km": "0.842"
    }
  ]
}
```

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
JWT_SECRET=replace_with_long_random_secret
```

Notes:
- Use URL encoding for special characters in DB password (example: `@` becomes `%40`).
- Use a strong random `JWT_SECRET` in production.

### Frontend (`.env` optional)

```env
VITE_API_BASE_URL=http://localhost:5000
```

If omitted, frontend currently falls back to `http://localhost:5000`.

## Quick Start (Local)

1. Clone repository

```bash
git clone https://github.com/AshirwadKumar950/CityMatch.git
cd CityMatch
```

2. Install frontend dependencies

```bash
npm install
```

3. Install backend dependencies

```bash
cd backend
npm install
```

4. Configure backend env
- Create/update `backend/.env` with valid database and JWT values.

5. Start backend (terminal 1)

```bash
cd backend
npm run dev
```

6. Start frontend (terminal 2)

```bash
cd CityMatch
npm run dev
```

7. Open app
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Scripts

### Frontend (root)

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend (`backend`)

| Command | Purpose |
|---|---|
| `npm run dev` | Start backend with nodemon |
| `npm start` | Start backend with node |

## Database Notes

- Backend auto-creates `citymatch_users` table on startup.
- Place search expects an existing `places` table with geospatial-compatible `location` column.
- Place search query uses:
  - `ST_DWithin` for range filtering
  - `ST_Distance` for nearest sorting

## JWT Auth Notes

- JWT is generated in backend during register/login.
- Token expiry is currently set to 7 days.
- Protected route `/api/users/profile` validates `Authorization: Bearer <token>`.
- Frontend stores token in localStorage after login/signup.

## Troubleshooting

### Backend not starting
- Verify `backend/.env` exists.
- Check DB URL formatting and encoding.
- Ensure Supabase/Postgres is reachable.

### Invalid or expired token
- Confirm backend `JWT_SECRET` has not changed after token creation.
- Re-login to generate a fresh token.

### Place search returns empty
- Confirm `places` table has data.
- Confirm `location` geospatial column is populated.
- Try larger distance/time value.

## Roadmap

- Attach frontend profile page to protected `/api/users/profile`
- Add favorites/saved area support
- Add test coverage for auth and place search APIs
- Implement structured backend logger in `src/utils/logger.js`
