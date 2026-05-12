# Weather Forecast App

A full-stack weather forecast application built with Node.js, Express, PostgreSQL, Redis, and React.

## Features

- User authentication (register & login with JWT)
- Real-time current weather data
- 5-day weather forecast
- Save favourite locations
- Weather alerts via email
- Redis caching (20 min TTL)
- Automated email notifications using cron jobs

---

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- JWT Authentication
- bcrypt
- Nodemailer
- node-cron
- Docker

### Frontend
- React.js
- Vite
- Tailwind CSS
- Zustand
- Axios
- React Router v6

---

## Project Structure

```bash
weather-forecast-app/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│   └── index.js
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── store/
│
├── docker-compose.yml
└── README.md
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- Docker Desktop
- OpenWeatherMap API key
- Gmail account with App Password

---

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/weather-forecast-app.git
cd weather-forecast-app
```

---

## 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Fill in your actual values in `.env`.

---

## 3. Start PostgreSQL & Redis

```bash
docker-compose up -d
```

---

## 4. Run Prisma Migrations

```bash
npx prisma migrate dev
```

---

## 5. Start Backend Server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## 6. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Weather

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather/current?city=Mumbai` | Current weather |
| GET | `/api/weather/forecast?city=Mumbai` | 5-day forecast |

### Locations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Get saved locations |
| POST | `/api/locations` | Save a location |
| DELETE | `/api/locations/:id` | Delete a location |

### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | Get all alerts |
| POST | `/api/alerts` | Create an alert |
| DELETE | `/api/alerts/:id` | Delete an alert |

---

## Author

Built by Riya