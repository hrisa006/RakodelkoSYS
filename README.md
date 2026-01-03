# RakodelkoSYS

Single-page marketplace for handmade and vintage gifts, clothing, and craft supplies. Sellers can list items, buyers can add to cart, checkout, and leave reviews. Admins can manage users, items, and orders.

## What it is
- Marketplace for unique, handcrafted products
- SPA frontend (Vite + React + TypeScript)
- API backend (Express + TypeScript + Sequelize + Postgres)
- JWT auth stored in a cookie
- Stripe Checkout for test payments

## How it works
- Anonymous users can browse items and pages
- Registered users can create listings, manage their items, add to cart, checkout, and review products
- Admins can manage users, items, and orders via admin endpoints

## Project structure
- `backend/` Express API (TypeScript)
- `frontend/` Vite React app (TypeScript)
- `docs/` documentation

## Requirements
- Node.js (LTS)
- PostgreSQL running locally

## Setup
1) Install deps from repo root:
```bash
npm install
```

2) Create backend env file `backend/.env`:
```ini
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost

ACCESS_TOKEN_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
```

3) Create frontend env file `frontend/.env`:
```ini
VITE_API_URL=http://localhost:8080
```

## Run the app
- Start both backend + frontend:
```bash
npm run dev
```

- Backend only:
```bash
npm run back
```

- Frontend only:
```bash
npm run front
```

Frontend runs on `http://localhost:5173` and API on `http://localhost:8080`.

## Stripe test payments
- Checkout uses Stripe Checkout (test mode)
- Prices are displayed in BGN on the site, converted to EUR for Stripe
- Test card: `4242 4242 4242 4242`, any future date, any CVC

## Key endpoints (API)
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- Items: `/api/items`, `/api/items/:id`, `/api/items/me`
- Cart: `/api/cart`
- Orders: `/api/orders`, `/api/orders/checkout`, `/api/orders/:id`
- Reviews: `/api/items/:itemId/reviews`
- Media: `/api/media`

## Notes
- CORS default: `http://localhost:5173`
- Uploaded media served from `backend/uploads`
- Sequelize sync runs on startup

## Page Visualization
- Home
- About
- Products
- Login and Register
- Profile
- Cart
- Invoice

## Docs
See `docs/Ръкоделко - 3MI0700178.docx` for the full spec and use cases.
