# TaskFlow — REST API with Auth & Role-Based Access

A production-ready backend with JWT authentication, role-based access control, full CRUD, Swagger docs, and a React frontend.

##  Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Node.js + Express.js              |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT + bcryptjs                    |
| Validation | express-validator                 |
| Docs       | Swagger UI (swagger-jsdoc)        |
| Frontend   | React 18 (Create React App)       |

---

##  Quick Start

### 1. Backend

```bash
cd backend
npm install
# Edit .env with your MongoDB URI (default works with local MongoDB)
npm run dev
```

Server runs at: `http://localhost:5000`
API Docs at:    `http://localhost:5000/api-docs`
Health check:   `http://localhost:5000/health`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

##  API Reference (v1)

### Auth Endpoints
| Method | Route                  | Description          | Auth |
|--------|------------------------|----------------------|------|
| POST   | /api/v1/auth/register  | Register new user    | ❌   |
| POST   | /api/v1/auth/login     | Login, returns JWT   | ❌   |
| GET    | /api/v1/auth/me        | Get current user     | ✅   |

### Task Endpoints
| Method | Route               | Description               | Auth |
|--------|---------------------|---------------------------|------|
| GET    | /api/v1/tasks       | Get tasks (own or all)    | ✅   |
| POST   | /api/v1/tasks       | Create task               | ✅   |
| GET    | /api/v1/tasks/:id   | Get task by ID            | ✅   |
| PUT    | /api/v1/tasks/:id   | Update task               | ✅   |
| DELETE | /api/v1/tasks/:id   | Delete task               | ✅   |

### Admin Endpoints (admin role only)
| Method | Route                     | Description           |
|--------|---------------------------|-----------------------|
| GET    | /api/v1/admin/stats       | App statistics        |
| GET    | /api/v1/admin/users       | All users             |
| DELETE | /api/v1/admin/users/:id   | Delete user + tasks   |

---

##  Security Practices

- Passwords hashed with **bcryptjs** (12 salt rounds)
- **JWT tokens** with configurable expiry (default: 7 days)
- **Role-based middleware** — `protect` + `restrictTo('admin')`
- Input validation with **express-validator** on every route
- Mongoose schema-level validation as second layer
- Error messages sanitized — no stack traces in production
- `password` field excluded from all queries via `select: false`

---

##  Database Schema

### User
```
name        String   required, 2–50 chars
email       String   unique, validated format
password    String   hashed, excluded from queries
role        Enum     ['user', 'admin'], default: 'user'
createdAt   Date     auto
updatedAt   Date     auto
```

### Task
```
title       String   required, 2–100 chars
description String   optional, max 500 chars
status      Enum     ['pending', 'in-progress', 'completed']
priority    Enum     ['low', 'medium', 'high']
user        ObjectId ref: User (required)
createdAt   Date     auto
updatedAt   Date     auto
```

---

##  Scalability Note

### Current Design
- **MVC architecture** with clean separation of concerns
- **API versioning** (`/api/v1/`) — add `/api/v2/` without breaking existing clients
- **Modular routing** — new entities (products, notes) plug in with 3 files

### Scaling Path
1. **Horizontal scaling**: JWT is stateless → multiple instances behind NGINX load balancer
2. **Caching**: Add Redis (`ioredis` + `express-rate-limit`) for session cache and rate limiting
3. **Database**: Add compound indexes on `{ user, status }` for Task queries; use MongoDB Atlas for managed scaling
4. **Microservices**: Split auth service, task service, notification service — communicate via Kafka/RabbitMQ
5. **Docker**: Containerize with `Dockerfile` + `docker-compose.yml` → deploy to AWS ECS or Kubernetes

---

##  Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_minimum_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
```
