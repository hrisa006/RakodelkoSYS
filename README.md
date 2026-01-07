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
<img width="1868" height="898" alt="brave_screenshot_localhost" src="https://github.com/user-attachments/assets/04fe7e29-01cc-423e-b088-67e139aa628e" />
<img width="1868" height="898" alt="brave_screenshot_localhost (1)" src="https://github.com/user-attachments/assets/15667b35-018c-44d8-ad3a-02af61071355" />
<img width="1868" height="897" alt="brave_screenshot_localhost (2)" src="https://github.com/user-attachments/assets/ef235b28-465f-4733-a102-e865dd429c37" />

- About
<img width="1867" height="898" alt="about" src="https://github.com/user-attachments/assets/1bbebe76-35d2-4956-b15b-4e5bb24d6284" />

- Products
<img width="1868" height="898" alt="new" src="https://github.com/user-attachments/assets/7e533253-86ac-4f46-a41c-55cdbdb06ffb" />
<img width="1868" height="898" alt="all" src="https://github.com/user-attachments/assets/bc645c8c-b385-4f56-bd0f-3df5ebcc09b5" />
<img width="1867" height="896" alt="single_item1" src="https://github.com/user-attachments/assets/4fc3acd2-931a-479a-9d50-44508bcfba16" />
<img width="1867" height="896" alt="single_item2" src="https://github.com/user-attachments/assets/dbc8cc26-9543-421a-8afd-fe85c11c01d0" />

- Login and Register
<img width="1867" height="898" alt="login" src="https://github.com/user-attachments/assets/485e98a5-7518-4c18-805b-97a475f1072d" />
<img width="1866" height="898" alt="register" src="https://github.com/user-attachments/assets/83be8d0a-bcb5-495d-b9a6-4bd176437dad" />

- Profile
<img width="1868" height="898" alt="profile1" src="https://github.com/user-attachments/assets/1600721b-87a3-427a-93af-f6444835d7dd" />
<img width="1867" height="898" alt="profile2" src="https://github.com/user-attachments/assets/05ccd0bb-403a-493b-9077-1017668e1acc" />
<img width="1866" height="897" alt="profile3" src="https://github.com/user-attachments/assets/5aa75551-db63-487d-a768-bfce65b2d3a2" />
<img width="1868" height="898" alt="profile4" src="https://github.com/user-attachments/assets/4ee5332b-5155-4ea4-a82c-c8717ef16472" />

- Cart
<img width="1867" height="897" alt="cart" src="https://github.com/user-attachments/assets/dd7fc3ff-bf32-47bc-8781-c159010d1189" />

- Invoice
<img width="1867" height="898" alt="receipt" src="https://github.com/user-attachments/assets/a4b5d7a1-ac3e-4bcc-b476-7ae02ce95ecb" />

## Docs
See `docs/Ръкоделко - 3MI0700178.docx` for the full spec and use cases.
