# ✨ GlowSuite – Production-Grade Salon Booking Platform

## Overview

GlowSuite is a scalable, event-driven salon booking platform built with modern system design principles. It supports real-time slot availability, Stripe-based payments, Redis-backed locking, and reliable event processing using the Outbox pattern.

The system is designed to simulate real-world production architecture used in high-scale applications, making it ideal for demonstrating senior-level engineering skills.

---

## 🧠 System Design (High-Level Architecture)
            ┌───────────────┐
            │   Frontend    │
            │ React + Vite  │
            └───────┬───────┘
                    │ HTTP / WebSocket
                    ▼
            ┌───────────────┐
            │   API Layer   │
            │ Express Server│
            └───────┬───────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Auth Module│ │Booking Mod │ │Billing Mod │
└─────┬──────┘ └─────┬──────┘ └─────┬──────┘
│ │ │
▼ ▼ ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ MongoDB │ │ Redis │ │ Stripe API │
│ (Data) │ │ (Locking) │ │ Payments │
└────────────┘ └────────────┘ └────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ Outbox Worker │
            │ Background Job│
            └───────┬───────┘
                    ▼
            ┌───────────────┐
            │ Notifications │
            │ Email / Events│
            └───────────────┘
        
---

## 🏗️ Architecture

GlowSuite follows a **Clean Architecture + Modular Monolith** design.
backend/
├── src/
│ ├── API/ → Express entry point
│ ├── App/ → Use cases (business workflows)
│ ├── Domain/ → Core business rules
│ ├── Infra/ → DB, Redis, Stripe
│ ├── Contracts/ → DTOs & schemas
│
├── Modules/
│ ├── Auth/
│ ├── Booking/
│ ├── Billing/
│ ├── Notification/
│ ├── Admin/
│
├── Workers/ → Outbox processor
├── Tests/
   
---

## ⚙️ Runtime Flow
User selects service & stylist
API validates JWT
Redis lock applied (prevent double booking)
Booking created in MongoDB
Stripe session created
User completes payment
Stripe webhook confirms payment
Booking updated → confirmed
Event saved to Outbox
Worker processes event
Email notification sent

---

## 🔁 Low-Level Flow (Booking + Payment)
## 🔁 Low-Level Flow (Booking + Payment)


[Client]
↓
POST /booking/create
↓
[Booking Service]
↓
Redis Lock (slot)
↓
MongoDB Save (pending)
↓
Stripe Checkout Session
↓
User Payment
↓
Stripe Webhook
↓
Update Booking → confirmed
↓
Insert Outbox Event
↓
Worker consumes event
↓
Send Email / Notification

---

## 🧩 Modules

### Auth
- JWT authentication
- Role-based access (admin, stylist, customer)

### Booking
- Real-time availability
- Redis slot locking
- Prevent double booking

### Billing
- Stripe integration
- Webhook verification
- Invoice generation

### Notification
- Email system
- Outbox-based delivery

### Admin
- Dashboard analytics
- Booking management
- Calendar view

---

## 🚀 Key Features

- 🔒 Redis-based locking (no double booking)
- ⚡ Real-time updates (Socket.IO)
- 💳 Stripe payments (secure + webhook verified)
- 🧠 Outbox pattern (no data loss)
- 🔁 Retry + Dead-letter ready
- 📊 Admin dashboard
- 📬 Email notifications

---

## 🧪 Technology Stack

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Redis

### Frontend
- React (Vite)
- Tailwind CSS

### Realtime
- Socket.IO

### Payments
- Stripe API

### DevOps
- Docker
- GitHub Actions (CI/CD)

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Stripe account

---

### Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
REDIS_URL=redis://localhost:6379


Run Backend

cd backend
npm install
npm run dev

Run Frontend

cd frontend
npm install
npm run dev

Run Redis

docker run -d -p 6379:6379 redis

🔁 CI/CD Pipeline (GitHub Actions)

Create file:

.github/workflows/ci.yml

CI Pipeline

name: GlowSuite CI/CD

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo
        ports:
          - 27017:27017

      redis:
        image: redis
        ports:
          - 6379:6379

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: 18

    - name: Install Backend
      run: |
        cd backend
        npm install

    - name: Install Frontend
      run: |
        cd frontend
        npm install

    - name: Run Tests
      run: |
        cd backend
        npm test

    - name: Build Frontend
      run: |
        cd frontend
        npm run build

🐳 Docker (Production Ready)

# backend/Dockerfile
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5000

CMD ["npm", "run", "start"]


🔮 Future Enhancements
Microservices (Auth / Booking / Billing split)
RabbitMQ / AWS SQS
Kubernetes (EKS)
AI booking assistant (LLM + RAG)
Observability (Prometheus + Grafana)

📊 Why This Project Stands Out

GlowSuite demonstrates:

Real-world system design
Distributed system patterns
Payment reliability
Scalable architecture


📚 Documentation
/docs/architecture.md
/docs/api.md
/docs/outbox.md