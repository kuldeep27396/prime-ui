# Prime UI — Real-Time Interview Platform Frontend

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss&logoColor=white)
![100ms](https://img.shields.io/badge/100ms-Video%20SDK-blueviolet)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6c47ff)
![Monaco](https://img.shields.io/badge/Monaco-Code%20Editor-007acc)

> The frontend for **Prime**, a real-time technical interview platform with live video, collaborative code editing, and authenticated sessions — built with React, the 100ms video SDK, and a Monaco-powered editor.

## Overview

Prime UI is the web client for a remote interviewing experience: interviewers and candidates join a live video room, collaborate on code in real time, and authenticate securely. It pairs with the **Prime backend** service and is designed for low-latency, face-to-face technical interviews.

## Features

- 🎥 **Live video rooms** powered by the 100ms SDK
- 💻 **In-browser code editor** (Monaco) for collaborative problem solving
- 🔐 **Authentication** via Clerk
- 🎨 **Modern UI** with Radix UI primitives + Tailwind CSS
- ⚡ **Fast builds** with Vite

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS + Radix UI |
| Video | @100mslive/react-sdk |
| Code Editor | @monaco-editor/react |
| Auth | Clerk |
| Linting | ESLint |

## Project Structure

```
├── src/
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   ├── index.css          # Global styles
│   └── env.local          # Local environment config
├── public/                # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env   # add Clerk + 100ms keys

# 3. Run the dev server
npm run dev
```

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview production build
npm run lint      # lint with ESLint
```

See [`SETUP-100MS.md`](./SETUP-100MS.md) for 100ms room/token setup details.

## Author

**Kuldeep Pal** — [GitHub](https://github.com/kuldeep27396) · [Portfolio](https://www.kuldeep-pal.in/)
