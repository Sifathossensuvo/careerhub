# CareerHub BD — Bangladesh's Career Platform (MVP)

A full-stack job platform for Bangladesh: job search, recruiter tools, admin panel,
manual bKash/Nagad premium subscriptions, and rule-based AI career tools.

This is a working **MVP foundation**, not the entire imaginable feature set (see
"What's included vs. what's next" below). It's built to run locally, be extended,
and deployed.

---

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + React Router
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT Auth
- **Payments:** Manual bKash/Nagad verification (no payment gateway)
- **AI Features:** Rule-based/heuristic logic (zero API cost) — swappable for a real LLM later

---

## Project Structure

```
careerhub-bd/
├── backend/          # Express API
│   ├── config/       # DB connection
│   ├── models/       # Mongoose schemas
│   ├── controllers/  # Route logic
│   ├── routes/       # Express routers
│   ├── middleware/   # Auth guards, error handler
│   ├── utils/        # Token, email helpers
│   ├── seed.js       # Creates admin user + categories
│   └── server.js     # Entry point
└── frontend/         # React app
    └── src/
        ├── pages/        # Route-level pages
        ├── components/   # Reusable UI
        ├── context/       # Auth context
        ├── services/      # Axios API calls
        └── hooks/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
cp .env.example .env     # edit MONGO_URI, JWT_SECRET, SMTP creds, bKash/Nagad numbers
npm install
npm run seed              # optional: creates admin@careerhubbd.com / Admin@12345 + categories
npm run dev                # starts on http://localhost:5000
```

> Note: `npm run seed` isn't in package.json's scripts by default — run `node seed.js` directly, or add `"seed": "node seed.js"` to `backend/package.json`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # set VITE_API_URL if backend isn't on localhost:5000
npm install
npm run dev                # starts on http://localhost:5173
```

Open http://localhost:5173 in your browser.

---

## Default Admin Login (after seeding)

```
Email:    admin@careerhubbd.com
Password: Admin@12345
```

**Change this password immediately in a real deployment.**

---

## How the Manual Payment System Works

1. User selects a plan on `/pricing` → redirected to `/payment/submit`.
2. Page shows the bKash/Nagad number (from backend `.env`).
3. User sends money manually via their phone, then submits Transaction ID + sender number.
4. Payment appears in Admin → Payments as "Pending".
5. Admin clicks Approve → user's `isPremium`/`premiumPlan` (or recruiter plan) is activated for 30 days.
6. Admin clicks Reject → user is notified, nothing is activated.

No card numbers, no payment gateway — everything is manually verified, matching the original spec.

---

## AI Features — Important Note

The `/api/ai/*` endpoints (resume score, ATS check, cover letter generator, skill gap analysis,
interview questions) use **rule-based logic**, not a real language model. This keeps the platform
fully functional with **zero API cost**. Each controller function in
`backend/controllers/aiController.js` is a self-contained scoring/template heuristic.

To upgrade any of these to real AI-generated output, replace the logic inside the relevant
function with a call to your model of choice (e.g. the Anthropic API) using your own API key —
the request/response shape is designed to stay the same so the frontend won't need changes.

---

## What's Included (Working MVP)

- Auth: register (jobseeker/recruiter), login, JWT sessions, email verification, forgot/reset password
- Job search with filters (category, location, type, experience, remote, salary — salary filter gated behind Premium)
- Job details + apply flow with daily application limits for free users
- Recruiter panel: company profile, post/edit/delete jobs, view & manage applicants (shortlist/reject/hire)
- Admin panel: dashboard stats, user management (ban/unban), company approval/ban/feature, job moderation, payment approval/rejection, broadcast notifications
- Manual bKash/Nagad payment submission + admin verification workflow
- Premium plans (Basic/Pro/Elite) and Recruiter plans (Free/Business/Enterprise) — static catalogue, enforced via the payment approval flow
- Resume/profile builder (skills, experience, education) + rule-based AI tools (resume score, ATS check, cover letter, skill gap, interview questions)
- Notifications system
- Dark glassmorphism SaaS UI, fully responsive

## What's Not Included Yet (Reasonable Next Steps)

- Google Login (stubbed for later — needs OAuth app credentials)
- Cloudinary image upload wiring in the frontend (backend/model support is there; add an upload form + Cloudinary widget)
- Bengali language toggle (i18n)
- Real payment gateway (bKash/Nagad merchant API, SSLCommerz, etc.) — currently manual-only by design
- Wallet withdraw flow, referral payout logic (models exist, endpoints don't yet)
- PDF export for the resume builder (currently just stores structured data; adding a PDF template renderer is the next step)
- Real AI integration (swap the rule-based logic — see above)
- Automated tests

---

## Security Notes Before Going to Production

- Change `JWT_SECRET` and the seeded admin password immediately.
- Set `NODE_ENV=production` and restrict CORS `CLIENT_URL` to your real domain.
- Put the API behind HTTPS.
- Consider adding request validation (e.g. `express-validator`, already in `package.json`) to every route body — only a subset of routes currently validate input beyond "required fields."
