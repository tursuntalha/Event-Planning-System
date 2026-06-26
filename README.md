# EventAI — AI-Powered Smart Event Management System

> *"Etkinliği planla, AI organize etsin."*

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logoColor=white)

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)

Event planning is chaotic. Coordinating schedules across ten attendees, writing compelling event descriptions, avoiding double-bookings — all done manually. EventAI adds an AI layer to a real-time event management system: it finds optimal meeting times, writes event content, and detects scheduling conflicts automatically.

---

## AI Features

### 1. Smart Scheduling Assistant
Paste attendee availability in plain text → AI finds the best slot:

```
Input to AI:
  Ahmet: Pazartesi 10-12, Çarşamba 14-17
  Selin: Pazartesi 11-15, Perşembe tüm gün
  Mehmet: Salı-Çarşamba 9-18
  Constraint: 2 saat blok, en az 3 kişi

AI Output:
  Best slot: Çarşamba 14:00–16:00 (Ahmet + Selin + Mehmet — tüm katılımcılar müsait)
  Alternative: Pazartesi 11:00–12:00 (2/3 katılımcı)
```

### 2. AI Event Description Generator
```
User prompt: "React ve Node.js konularında junior geliştiriciler için teknik workshop"

AI Output:
  Title: "Full-Stack Jumpstart: React + Node.js Workshop"
  Description: "Kariyer yolculuğunuzun başında React ve Node.js ekosistemini
  derinlemesine öğrenmek için tasarlanmış bu interaktif workshop..."
  Tags: [workshop, react, nodejs, junior, frontend, backend]
```

### 3. Conflict Detector
When creating a new event, AI analyzes the calendar and warns:
- "This overlaps with 'Product Demo' targeting the same audience (engineering team)"
- "A similar technical workshop was held 3 days ago — consider spacing them out"

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│              React + Vite (Tailwind CSS)               │
│   Calendar View | Event Form | RSVP | AI Chat Panel    │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP + WebSocket
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Express + Socket.io                  │
│   Auth → Event CRUD → AI Service → RSVP → Notify      │
└──────┬────────────────┬───────────────┬────────────────┘
       │                │               │
       ▼                ▼               ▼
  ┌─────────┐    ┌──────────┐    ┌───────────┐
  │ MongoDB │    │  Ollama  │    │ Nodemailer│
  │ Events  │    │ qwen2.5  │    │   SMTP    │
  │  Users  │    │(schedule │    │ (invites, │
  │  RSVPs  │    │ +content)│    │  reminders│
  └─────────┘    └──────────┘    └───────────┘
```

---

## Full Feature List

- Event CRUD (create, edit, delete, view)
- Real-time updates via Socket.io (new event appears instantly for all users)
- Calendar view (FullCalendar.js — month, week, day views)
- RSVP system (accept / decline / maybe) with attendee list
- AI scheduling assistant (Ollama + qwen2.5)
- AI event description generator
- Scheduling conflict detector
- Email invitations + reminders (Nodemailer)
- Role-based access: organizer (full control) vs attendee (RSVP only)
- JWT authentication

---

## Project Structure

```
Event-Planning-System/
├── server/
│   ├── index.js            # Express + Socket.io entry
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── routes/
│   │   ├── events.js
│   │   ├── auth.js
│   │   └── ai.js           # Ollama scheduling + content endpoints
│   └── services/
│       ├── aiService.js    # Ollama API calls
│       └── emailService.js # Nodemailer
└── yazlab/                 # React frontend (Vite + Tailwind)
    └── src/
        ├── pages/
        │   ├── Calendar.jsx
        │   ├── EventDetail.jsx
        │   └── CreateEvent.jsx
        └── components/
            └── AIAssistantPanel.jsx
```

---

## Setup

```bash
# Backend
cd server && npm install && npm start

# Frontend
cd yazlab && npm install && npm run dev

# Ollama (for AI features)
ollama pull qwen2.5:7b
ollama serve
```

---

## Roadmap

- [x] **Phase 1** — Event CRUD + MongoDB schema + JWT auth
- [x] **Phase 2** — Real-time updates via Socket.io + calendar view (FullCalendar.js)
- [x] **Phase 3** — RSVP system + email notifications (Nodemailer)
- [x] **Phase 4** — AI scheduling assistant + description generator (Ollama qwen2.5)
- [x] **Phase 5** — Conflict detector + role-based access + mobile-responsive polish
