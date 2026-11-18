# LifeDrops — Quick start (Windows / VS Code)

This is a **portfolio prototype**. Database setup and real browser tests still need to be completed before public deployment.

## 1. Database
Create a PostgreSQL database (local PostgreSQL or a managed PostgreSQL service). Copy its connection string.

## 2. Backend terminal
```powershell
cd server
npm install
copy .env.example .env
```
Edit `server/.env`: set `DATABASE_URL` to your real connection string, and `JWT_SECRET` to a unique random string at least 32 characters long. Then run:
```powershell
npx prisma db push
npm run dev
```
Check http://localhost:5000/health.

## 3. Frontend terminal (second terminal)
```powershell
cd client
npm install
copy .env.example .env
npm run dev
```
Open http://localhost:5173.

## 4. Test before publishing
Register two accounts. Create a donor profile with the first. Create a blood request with the second. Check donor search, request details, donor responses, status updates, and persistence after restarting the server.

## 5. Deployment
Use Vercel for `client`, Render for `server`, and a persistent PostgreSQL database. Set `VITE_API_URL=https://YOUR-BACKEND/api`, `CLIENT_ORIGIN=https://YOUR-FRONTEND`, `DATABASE_URL`, and `JWT_SECRET`. Never commit `.env`.

Demo seed data is local-only. Do not publish a default admin password or claim this is an emergency service.
