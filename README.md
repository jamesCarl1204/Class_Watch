# AssessWatch (Online Assessment Monitoring)

AssessWatch is an online assessment and interview activity-monitoring system. It provides a dashboard for reviewing browser activity signals such as tab switches, window focus loss, AI-related paste activity, and access to AI websites during an assessment.

> **Status:** Teacher authentication and the dashboard UI are done. Live sessions, the student Chrome extension, and real-time telemetry are still in progress.

## Tech Stack

<p>
  <img src="https://skillicons.dev/icons?i=react,vite,nodejs,express,mysql,css,js" alt="React, Vite, Node.js, Express, MySQL, CSS, JavaScript" />
</p>

React · Vite · React Router · CSS Modules · Node.js · Express · MySQL · JWT · bcrypt

## Features

- Teacher register, login, and logout with JWT httpOnly cookie sessions
- Live dashboard: stat cards, student roster with search and risk filters, activity feed
- Per-student timeline and warning alerts
- Monitoring signals for tab switches, window focus loss, AI-related paste activity, and AI website access
- Light and dark theme

## Run Locally

```bash
# frontend
npm install
npm run dev

# backend
cd server
npm install
npm run dev
```

Create `server/.env`:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=classwatch
JWT_SECRET=a_long_random_string
```
