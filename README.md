# ⚾ Youth Baseball Enrollment

A simple, responsive React + SCSS app to manage youth baseball signups. Parents (or admins) submit players; coaches can track paid/unpaid status and promote players through divisions. Data is persisted in AWS DynamoDB via Vercel Serverless Functions.

Live: https://youth-baseball.vercel.app/

Repo: https://github.com/Tuscaney/youth-baseball

## ✨ Features
- 📝 New Enrollment form (player + guardian info, division, notes)
- 📋 List of enrollments rendered with .map()
- 💳 Toggle Paid (Update)
- ⬆️ Next Division (cycles T-Ball → Coach Pitch → Minor → Major)
- 🗑️ Delete Enrollment
- 🎨 SCSS styling + responsive layout
- ☁️ DynamoDB CRUD via Vercel /api routes
- ✅ Vitest unit tests


## 🧭 Capstone Requirements Mapping

- Project Setup & Deployment (10 pts): Vite + Vercel ✅
- AWS/Database Integration (20 pts): DynamoDB CRUD (Create/Read/Update/Delete) ✅
- Styling & Responsiveness (15 pts): SCSS + responsive grid/cards ✅
- JS & React Fundamentals (25 pts): Components, state, custom functions, .map() ✅
- Testing (15 pts): Vitest tests for components/services/utils ✅
- Presentation & Code Explanation (15 pts): Walkthrough + code details below ✅

## 🏗️ Architecture

youth-baseball/
├─ api/
│  ├─ _ddb.js                   # DynamoDB DocumentClient factory (uses env vars)
│  └─ enrollments/
│     ├─ index.js               # GET (list), POST (create)
│     └─ [id].js                # PUT (update), DELETE (delete)
├─ public/
│  
├─ src/
│  ├─ App.jsx                   # UI: Hero + Form + List; state & handlers
│  ├─ main.jsx                  # React root; imports SCSS
│  ├─ services/
│  │  └─ enrollments.js         # browser fetch helpers (and in-memory mode for tests)
│  ├─ styles/
│  │  └─ main.scss              # tokens, layout, hero, buttons, pills
│  └─ utils/ ...                # (if present)
├─ vercel.dev.bak               # SPA rewrite + keep /api
├─ package.json                 # scripts, deps
└─ vitest config via package.json


## 🔐 Environment Variables

Create these in Vercel → Project → Settings → Environment Variables for Development, Preview, and Production (same names/values):

AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=YOUR_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET
DDB_TABLE=YouthBaseballEnrollments
VITE_API_BASE=

VITE_API_BASE is optional/blank for same-origin. Non-VITE_ vars are server-only (safe from the browser).


## 🗄️ Data Model (DynamoDB item)
{
  "id": "nanoid",
  "playerName": "string",
  "age": 10,
  "guardianName": "string",
  "contactPhone": "string",
  "division": "T-Ball | Coach Pitch | Minor | Major",
  "notes": "string",
  "paid": false,
  "createdAt": "ISO8601"
}

## 🔌 API Endpoints

- GET /api/enrollments → 200 [ ...items ]
- POST /api/enrollments → 201 { ...newItem }
  Body (JSON): { playerName, age, guardianName, contactPhone, division, notes, paid }
- PUT /api/enrollments/:id → 200 { ...updatedItem }
  Body: partial fields to update (e.g. { paid: true })
- DELETE /api/enrollments/:id → 204