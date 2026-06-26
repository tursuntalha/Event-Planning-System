# Event Planning System — Full Stack Real-Time Application

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

A full-stack event planning and management application with real-time updates powered by Socket.io. Create, manage, and coordinate events with a responsive UI built on React + Vite + Tailwind.

---

## Architecture

```
┌────────────────────────────────────────┐
│     React + Vite + Tailwind CSS        │
│           localhost:3000               │
└────────────────────┬───────────────────┘
                     │  HTTP REST + WebSocket
┌────────────────────▼───────────────────┐
│         Express.js + Socket.io         │
│              localhost:5000            │
│  ─ REST API for CRUD operations       │
│  ─ Socket.io for real-time events     │
└────────────────────┬───────────────────┘
                     │
              [ Database ]
```

---

## Features

- Create, update, and delete events
- Real-time event updates via WebSocket (Socket.io)
- Responsive UI with Tailwind CSS
- Full-stack communication via REST + WebSocket hybrid

---

## Project Structure

```
Event-Planning-System/
├── server/             # Backend
│   ├── models/         # Data models
│   ├── index.js        # Express app setup
│   └── server.js       # Socket.io server
└── yazlab/             # Frontend (React + Vite + Tailwind)
    ├── src/
    │   ├── components/
    │   └── pages/
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## Installation

### 1. Frontend

```bash
cd yazlab
npm install
```

### 2. Backend

```bash
cd server
npm install
```

---

## Running the Project

```bash
# Terminal 1 — Frontend (http://localhost:3000)
cd yazlab && npm run dev

# Terminal 2 — Backend API (http://localhost:5000)
cd server && npm start

# Terminal 3 — Socket.io server (if separate)
cd server && node server.js
```

---

## API Overview

| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | `/api/events`   | List all events      |
| POST   | `/api/events`   | Create a new event   |
| PUT    | `/api/events/:id` | Update an event    |
| DELETE | `/api/events/:id` | Delete an event    |

Real-time updates are pushed via Socket.io to all connected clients on any create/update/delete.

---

## Ports

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Backend | 5000 |

---

## Roadmap

- [ ] User authentication with JWT
- [ ] Event invitation system with email notifications (Nodemailer)
- [ ] Calendar view integration (FullCalendar.js)
- [ ] RSVP and attendee management
- [ ] Payment integration for ticketed events (Stripe)
- [ ] Mobile app (React Native)
