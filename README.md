# Event Handling Platform (MERN)

A college event portal built with MongoDB, Express, React and Node.js. This package includes the frontend you uploaded plus the missing Express/Mongoose backend.

## Features
- Browse events and filter by category / upcoming date
- Create, edit and delete events
- Student event registration with seat-limit and deadline checks
- Prevent duplicate email or roll-number registration per event
- View event registrations and look up registrations by email
- Cancel a registration and restore the available-seat count

## Requirements
- Node.js 18 or newer
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## 1. Start MongoDB
For a local installation, start the MongoDB service. The default database is `event_handling`; MongoDB creates it automatically when the first record is saved.

## 2. Start backend (Terminal 1)
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and edit `MONGODB_URI` if using MongoDB Atlas.
```bash
npm run dev
```
Backend: http://localhost:5000  
Health check: http://localhost:5000/api/health

## 3. Start frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:3000).

## Important
- Keep both terminals running.
- Do not run `npm install` from the outer project folder; install separately inside `backend` and `frontend`.
- The frontend uses `/api` through the Vite proxy, so it expects the backend on port 5000.
- Admin routes are currently open (no login/authentication). Add authentication and role checks before deploying publicly.
- No real email is sent; the registration page's confirmation message is UI-only.
