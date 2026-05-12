# Weather Forecast App

A full-stack weather forecast application built with Node.js, Express, PostgreSQL, Redis, and React.

## Features

- User authentication with JWT (register and login)
- Real-time current weather data
- 5-day weather forecast
- Save favourite locations
- Weather alerts with email notifications
- Redis caching with 20 minute TTL
- Automated email alerts via cron job

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- Redis
- JWT + bcrypt
- Nodemailer
- node-cron
- Docker

### Frontend
- React.js + Vite
- Tailwind CSS
- Zustand
- Axios
- React Router v6

## Project Structure

```
weather-forecast-app/
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── weather.controller.js
│   │   ├── location.controller.js
│   │   └── alert.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── weather.routes.js
│   │   ├── location.routes.js
│   │   └── alert.routes.js
│   ├── services/
│   │   ├── weather.service.js
│   │   ├── email.service.js
│   │   └── cron.service.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── index.js
├── client/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── WeatherCard.jsx
│       │   ├── ForecastCard.jsx
│       │   └── LocationCard.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Dashboard.jsx
│       ├── services/
│       │   └── api.js
│       └── store/
│           └── authStore.js
├── docker-compose.yml
└── README.md
```

## Database Schema

```
User
├── id
├── name
├── email (unique)
├── password (hashed)
├── createdAt
├── locations []
└── alerts []

Location
├── id
├── city
├── latitude
├── longitude
├── userId (foreign key)
└── createdAt

Alert
├── id
├── city
├── alertType
├── isActive
├── userId (foreign key)
└── createdAt
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |

### Weather
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/weather/current?city=Mumbai` | Get current weather | No |
| GET | `/api/weather/forecast?city=Mumbai` | Get 5-day forecast | No |

### Locations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/locations` | Get all saved locations with weather | Yes |
| POST | `/api/locations` | Save a new location | Yes |
| DELETE | `/api/locations/:id` | Delete a saved location | Yes |

### Alerts
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/alerts` | Get all alerts | Yes |
| POST | `/api/alerts` | Create a weather alert | Yes |
| DELETE | `/api/alerts/:id` | Delete an alert | Yes |

## Setup and Installation

### Prerequisites
- Node.js v18 or higher
- Docker Desktop
- OpenWeatherMap API key (free at openweathermap.org)
- Gmail account with App Password enabled

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/weather-forecast-app.git
cd weather-forecast-app
```

### 2. Setup backend
```bash
cd server
npm install
```

Copy the example env file and fill in your values:
```bash
cp .env.example .env
```

Your `.env` file should contain:
```
PORT=5000
DATABASE_URL=postgresql://weather_user:weather_pass@localhost:5432/weather_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_long_random_secret
WEATHER_API_KEY=your_openweathermap_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3. Start PostgreSQL and Redis with Docker
```bash
docker-compose up -d
```

### 4. Run database migrations
```bash
cd server
npx prisma migrate dev
```

### 5. Start the backend server
```bash
npm run dev
```

### 6. Setup and start the frontend
```bash
cd client
npm install
npm run dev
```

### 7. Open the app
```
Frontend  →  http://localhost:5173
Backend   →  http://localhost:5000
```

## How Caching Works

Every weather request checks Redis first before calling the OpenWeatherMap API.

```
Request comes in for city "Mumbai"
        |
Check Redis cache
        |
   Found? ──── Yes ──── Return cached data (source: cache)
        |
        No
        |
Call OpenWeatherMap API
        |
Save response in Redis with 20 min TTL
        |
Return data to user (source: api)
```

## How Weather Alerts Work

A cron job runs every 30 minutes and checks all active alerts against current weather conditions.

```
Cron job runs every 30 minutes
        |
Fetch all active alerts from database
        |
For each alert → get current weather for that city
        |
Does weather match the alert type?
        |
   Yes ──── Send email notification to user
        |
   No  ──── Do nothing, check again in 30 minutes
```

Supported alert types:
- `rain` — triggers on Rain, Drizzle, Thunderstorm
- `storm` — triggers on Thunderstorm, Tornado
- `snow` — triggers on Snow
- `heat` — triggers when temperature exceeds 40°C
- `fog` — triggers on Fog, Mist, Haze

## Authentication Flow

```
Register:
User sends name, email, password
→ Password hashed with bcrypt (10 salt rounds)
→ User saved to PostgreSQL
→ Success response

Login:
User sends email, password
→ Find user by email
→ Compare password with stored hash
→ Generate JWT token (expires in 7 days)
→ Return token to client

Protected Routes:
Request arrives with Authorization: Bearer <token>
→ Middleware verifies token using JWT_SECRET
→ Attach user info to req.user
→ Allow request to proceed
```

## Author

Built by Riya as a full-stack learning project covering backend APIs, databases, caching, authentication, scheduled jobs, and React frontend development.