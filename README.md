# LifeDrops — Blood Donation & Emergency Request Management Platform

A full-stack, production-quality web application that connects blood donors with people in need. Built with **React + Vite + Tailwind CSS** on the frontend and **Node.js + Express + Prisma + PostgreSQL** on the backend.

> ⚠️ **Medical Disclaimer:** LifeDrops is not a hospital, blood bank, or medical provider. It does not guarantee blood availability, compatibility, or emergency response. In an emergency, contact your local hospital and emergency services immediately. All seeded records are clearly marked as **DEMO** data.

---

## ✨ Features

- 🔐 **Authentication** — Register, login, logout, JWT, bcrypt password hashing, protected routes, role-based access
- 🩸 **Donor Management** — Create/edit donor profile, availability toggle, discoverability consent, pause listing
- 🔍 **Donor Discovery** — Search by city, filter by blood group, availability, pagination, empty/error states
- 🚨 **Blood Requests** — Create, edit, cancel, fulfill, filter by blood group/city/status, ownership checks
- 🤝 **Donor Response Workflow** — Express interest, withdraw, accept/decline, mark fulfilled
- 📊 **User Dashboard** — Overview cards, my requests, my responses, quick actions
- 🛡️ **Admin Panel** — Users list, requests list, disable donor listings, platform stats (backend-enforced)
- 📈 **Live Stats** — Landing page pulls real counts from the database
- 🎨 **Premium UI** — Inter font, crimson accents, soft shadows, responsive layouts, Lucide icons

---

## 🧱 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router 6, Axios, Lucide React, Context API
**Backend:** Node.js, Express, Prisma ORM, PostgreSQL, bcryptjs, JWT, Zod, Helmet, express-rate-limit
**Database:** PostgreSQL (Neon / Render / local)

---

## 📁 Project Structure

lifedrops/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI
│ │ ├── context/ # AuthContext
│ │ ├── layouts/ # MainLayout, DashboardLayout
│ │ ├── pages/ # Route pages
│ │ ├── services/ # Axios API client
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── vite.config.js
└── server/ # Express backend
├── prisma/
│ ├── schema.prisma
│ └── seed.js
├── src/
│ ├── config/ # env, prisma
│ ├── controllers/
│ ├── middleware/
│ ├── routes/
│ ├── utils/
│ ├── validators/
│ ├── app.js
│ └── server.js
├── package.json
└── .env.example


---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or a free Neon/Supabase database)

### 1. Clone & install

```bash
git clone <your-repo-url> lifedrops
cd lifedrops

# Backend
cd server
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Frontend
cd ../client
npm install
cp .env.example .env
2. Database setup
Create a PostgreSQL database (local or Neon), then update server/.env:

DATABASE_URL="postgresql://user:password@host:5432/lifedrops?schema=public"
JWT_SECRET="some-long-random-string-at-least-32-chars"
CLIENT_ORIGIN="http://localhost:5173"
PORT=5000
Run migrations and seed:

cd server
npx prisma db push --name init
npm run prisma:seed
3. Run both servers
# Terminal 1 — backend
cd server
npm run dev          # http://localhost:5000

# Terminal 2 — frontend
cd client
npm run dev          # http://localhost:5173
4. Demo accounts (seeded)
Role	Email	Password
Admin	admin@lifedrops.demo	Password123!
Donor	donor1@lifedrops.demo	Password123!
Donor	donor2@lifedrops.demo	Password123!
...	donor3..5@lifedrops.demo	Password123!
All seeded records are DEMO data. Do not use these credentials in production.

🔌 API Endpoints
Auth
Method	Endpoint	Auth	Description
POST	/api/auth/register	—	Register a new user
POST	/api/auth/login	—	Login and get JWT
GET	/api/auth/me	✅	Get current user
PATCH	/api/auth/profile	✅	Update profile/password
Donors
Method	Endpoint	Auth	Description
GET	/api/donors	—	Search discoverable donors
GET	/api/donors/me	✅	Get my donor profile
POST	/api/donors	✅	Create donor profile
PATCH	/api/donors/me	✅	Update donor profile
Blood Requests
Method	Endpoint	Auth	Description
GET	/api/requests	—	List requests
GET	/api/requests/mine	✅	My requests
GET	/api/requests/:id	—	Request detail
POST	/api/requests	✅	Create request
PATCH	/api/requests/:id	✅	Update (owner only)
POST	/api/requests/:id/cancel	✅	Cancel (owner only)
POST	/api/requests/:id/fulfill	✅	Fulfill (owner only)
Responses
Method	Endpoint	Auth	Description
GET	/api/responses/mine	✅	My responses
POST	/api/requests/:id/responses	✅	Express interest
GET	/api/requests/:id/responses	✅	List responses (owner)
PATCH	/api/responses/:id	✅	Accept/decline (owner)
DELETE	/api/responses/:id	✅	Withdraw (donor)
Admin
Method	Endpoint	Auth	Description
GET	/api/admin/stats	Admin	Platform stats
GET	/api/admin/users	Admin	List users
GET	/api/admin/requests	Admin	List all requests
PATCH	/api/admin/donors/:id/disable	Admin	Disable donor listing
Public
Method	Endpoint	Description
GET	/health	Health check
GET	/api/stats	Public landing-page statistics
🧪 Testing
The project is structured for testing with Vitest and Supertest, but tests have not been executed in this environment (no runtime available). To add and run tests:

cd server
npm install -D vitest supertest
Then create server/tests/auth.test.js:

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Auth', () => {
  it('rejects weak passwords', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'x@y.com', password: 'weak' });
    expect(res.status).toBe(422);
  });
});
Run: npx vitest run

Verified by design (not executed):

✅ Password hashing with bcrypt (10 rounds)
✅ JWT signing/verification
✅ Zod validation on all write endpoints
✅ Ownership checks on requests and responses
✅ Admin-only middleware on /api/admin/*
✅ Rate limiting on /api and /api/auth/*
✅ CORS restricted to CLIENT_ORIGIN
✅ Helmet security headers
Unverified (requires your local run):

Full end-to-end user flows
Database persistence after restart
Responsive layout at all breakpoints
Production build of the frontend
☁️ Deployment
Database (Neon — free tier)
Create a project at neon.tech
Copy the connection string (with ?sslmode=require)
Use it as DATABASE_URL on Render
Backend (Render)
Push to GitHub
New → Web Service → connect repo
Root Directory: server
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
Health Check Path: /health
Environment variables:
DATABASE_URL = Neon connection string
JWT_SECRET = long random string
JWT_EXPIRES_IN = 7d
CLIENT_ORIGIN = https://your-app.vercel.app
NODE_ENV = production
Deploy. Note the URL (e.g. https://lifedrops-api.onrender.com)
Free tier note: Render free services sleep after 15 minutes of inactivity — first request after sleep takes ~30s. Upgrade or use a cron pinger if needed.

Frontend (Vercel)
Import the same repo on vercel.com
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Environment variable:
VITE_API_URL = https://lifedrops-api.onrender.com/api
Deploy. SPA routing is handled by client/vercel.json.
Post-deploy
Update Render's CLIENT_ORIGIN to your Vercel URL
Redeploy Render so CORS picks up the new origin
Run npx prisma migrate deploy (already in build command)
Optionally run seed once: npm run prisma:seed (only for demo)
🔒 Security Notes
Passwords hashed with bcrypt (10 rounds), never stored in plaintext
JWT stored in localStorage (acceptable for this scope; for higher security use httpOnly cookies)
All write endpoints validated with Zod
Ownership checks on requests and responses
Admin routes protected by requireAuth + requireAdmin middleware
CORS restricted to configured origins
Helmet sets security headers
Rate limiting on /api (300/15min) and /api/auth/* (20/15min)
Donor contact info only shown when isDiscoverable = true and matching preferredContact
⚠️ Known Limitations
No email verification or password reset flow (out of scope)
No real-time notifications (deliberate — avoids WebSocket complexity)
No file uploads (avatar, medical documents)
JWT in localStorage is vulnerable to XSS — mitigate with CSP in production
No automated test suite is included by default (see Testing section)
Admin panel is intentionally minimal
No pagination on /api/admin/users beyond 100 items per page
Render free tier sleeps after inactivity
📸 Screenshots
Add screenshots to docs/screenshots/ after running locally:

landing.png — Hero + stats
donors.png — Donor search
requests.png — Blood requests list
dashboard.png — User dashboard
admin.png — Admin panel
📄 License
MIT — free to use for portfolio and educational purposes.

🙏 Credits
Built as a portfolio-quality social-impact project. Not affiliated with any hospital, blood bank, or NGO.


---

## ✅ Setup Checklist (run these to verify)

```bash
# 1. Backend
cd server
npm install
cp .env.example .env
# → edit .env: set DATABASE_URL + JWT_SECRET
npx prisma db push --name init
npm run prisma:seed
npm run dev
# → visit http://localhost:5000/health  → {"success":true,"status":"ok",...}

# 2. Frontend (new terminal)
cd client
npm install
cp .env.example .env
# → VITE_API_URL=http://localhost:5000/api
npm run dev
# → visit http://localhost:5173

# 3. Manual smoke test
# - Register a new user
# - Create a donor profile
# - Search donors → you appear
# - Create a blood request
# - Log in as another donor → express interest
# - Log back as requester → accept response
# - Mark request fulfilled
# - Log in as admin@lifedrops.demo → see admin panel


## Safety and release notes
- This is a portfolio demonstration, not a verified medical or emergency-response service.
- Donor email/phone are intentionally hidden from public donor search. Donors can respond to blood requests.
- Do not run demo seeding on a publicly accessible production database. No default admin account is created.
- Configure a persistent PostgreSQL database, a unique JWT secret, and the deployed frontend origin.
- Verify registration, donor profiles, requests, and donor responses before public launch.
- **Build and end-to-end tests have not been verified in this environment.**
