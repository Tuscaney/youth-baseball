# YOUTH BASEBALL ENROLLMENT APP

React + Vite + SCSS frontend with Vercel Serverless API (Node) + DynamoDB (AWS SDK v3).

## Local Dev
1. Create `.env.local` (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DDB_TABLE, VITE_API_BASE=)
2. Run:
   ```bash
   vercel dev

   ##Scripts

- npm run dev - Vite dev server
- vercel dev - Local API + frontend on :3000
- npm run build - Production build
- npm test - Vitest

## API

- GET /api/enrollments
- POST /api/enrollments
- PUT /api/enrollments/:id
- DELETE /api/enrollments/:id


---

# 6) Link GitHub repo to Vercel (for auto-deploys)
- In **Vercel dashboard** → **Add New… → Project** → **Import Git Repository**  
- Select `youth-baseball`  
- Build Command: `npm run vercel-build`  
- Output Directory: `dist`  
- Add environment variables (Project → Settings → **Environment Variables**):
  - `AWS_REGION`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `DDB_TABLE` = `YouthBaseballEnrollments`
  - `VITE_API_BASE` (leave empty or `/`)
- Click **Deploy**  
- Copy the **live URL** for your README later.

---

# 7) Commit point (after the push)
```bash
git tag v0.1.0 -m "Initial deployable version"
git push origin v0.1.0
