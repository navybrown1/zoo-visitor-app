# Zoo Visitor App — Sprint 1 MVP

Cross-platform mobile prototype built with **Expo (React Native)** and a lightweight **Node.js/Express** mock API.

## Sprint 1 features

| ID | Feature |
|----|---------|
| F001 | Digital ticket purchasing & wallet (mock checkout + QR passes) |
| F002 | Interactive GPS park map with mock routing |
| F006 | Push notification scaffold for lost children / emergencies |
| F009 | Real-time parking availability widget |
| F010 | Restroom, accessibility, and family services map filters |
| F013 | Staff QR ticket scanning at entry |
| F014 | In-app weather and heat safety banner |

## Project structure

```
zoo-visitor-app/
├── mobile/          # Expo React Native app
├── server/          # Express mock API (port 3001)
├── package.json     # root scripts
└── README.md
```

## Prerequisites

- Node.js 18+
- Expo Go app (optional, for device testing)

## Setup

```powershell
cd C:\Users\Hoengager\Projects\zoo-visitor-app
npm run install:all
```

## Run

Start API + Expo together:

```powershell
npm run dev
```

Or separately:

```powershell
npm run server
npm run mobile
```

- API health: http://localhost:3001/api/health
- Android emulator uses `http://10.0.2.2:3001` automatically
- Physical device: set `EXPO_PUBLIC_API_URL=http://<your-lan-ip>:3001`

## Deploy (Vercel)

This repo is configured for Vercel:

- **Frontend:** Expo web static export (`mobile/dist`)
- **Backend:** Express API as a serverless function (`/api/*`)

```powershell
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard for automatic deploys on push.
