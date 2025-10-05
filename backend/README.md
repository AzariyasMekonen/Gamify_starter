# Adwa Full Starter (Backend + Frontend) - Ready to deploy

This starter contains a backend (Express + Socket.IO + Mongoose) and a static frontend under `/public`.

Features implemented:
- Register / Login (simple password auth)
- Labs with tasks
- Start lab session and submit task answers
- XP tracking and simple league calculation
- Realtime notifications via Socket.IO
- Leaderboard endpoint
- Badges listing and simple badge awarding trigger (server emits notifications)

## Quick local run
1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Install dependencies and run:

```bash
npm install
npm run dev
```

3. Seed sample data (after installing deps):

```bash
node scripts/seed.js
```

4. Open http://localhost:4000 and use the demo UI.

## Deploy to Render
- Push this repo to GitHub, create a new Web Service on Render with Root Directory = `/`.
- Build Command: `npm install`
- Start Command: `npm start`
- Add environment variable `MONGO_URI` pointing to your MongoDB Atlas cluster.

The frontend is served from the `public/` folder and will connect to Socket.IO automatically.

Note: This starter is for prototyping and learning. Do not use as-is in production (store answer keys hashed, add proper auth, validation, rate limiting, sanitization, etc.).
