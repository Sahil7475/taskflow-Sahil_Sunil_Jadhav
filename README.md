# TaskFlow

## 1. Overview

TaskFlow is a full-stack task management system that allows users to register, log in, create projects, manage tasks, assign tasks to themselves or others, and track progress efficiently.

It is designed as a minimal yet production-like application with authentication, relational data handling, a REST API, and a modern UI.

### ✨ Features

- JWT-based authentication
- Project management
- Task creation & tracking (Todo, In Progress, Done)
- Task prioritization (Low, Medium, High)
- Task assignment (self or other users)
- Drag-and-drop UI (React)
- Fully containerized with Docker
- Auto database migrations + seeding

---

## 🛠 Tech Stack

### Backend
- .NET 8 Web API
- Entity Framework Core (PostgreSQL)
- JWT Authentication
- Serilog (structured logging)
- Swagger (API documentation)

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Radix UI

### Database
- PostgreSQL

---

## 2. Architecture Decisions

### 🔹 Backend Architecture

The backend follows a clean layered architecture:


- **Controllers (API layer):** Handle HTTP requests
- **Services layer:** Contains business logic
- **Repositories layer:** Handles data access
- **EF Core:** ORM for database operations

#### ✅ Why this approach?

- Separation of concerns
- Easier testing and maintenance
- Scalable for future features

---

### 🔹 Authentication Strategy

- JWT Bearer Authentication
- Token validation includes:
  - Issuer
  - Audience
  - Expiry
  - Signing key

#### 👉 Tradeoff:
- JWT is stateless and scalable  
- But results in slightly larger payload size  
- No built-in revocation without additional mechanisms

---

### 🔹 Database Decisions

- Used PostgreSQL for:
  - Flexible data types (JSON, arrays, UUIDs)
  - Extensibility (custom functions & extensions)
  - High performance (indexing & query optimization)

---

### 🔹 Logging

- Implemented structured logging using Serilog (file-based)
- No centralized observability system (e.g., Grafana, ELK)

---

### 🔹 Frontend Decisions

#### Vite
- Fast dev server
- Optimized builds
- Better developer experience

#### React Hook Form + Zod
- Strong validation
- Clean form handling

#### Radix UI
- Accessible and composable UI components

---

### 🔹 Tradeoffs & Limitations

- No refresh token implementation (simplified auth flow)
- No role-based access control (RBAC)
- No real-time updates (e.g., WebSockets)
- Logging is file-based only (no centralized monitoring)
- Limited automated testing

These decisions were made to prioritize delivering a complete MVP within limited time.

---

## 3. Running Locally (Docker Only)

> **Prerequisite:** Only Docker is required. No need to install Node.js or .NET locally.

### 🔧 Steps

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
cp .env.example .env
docker compose up --build
```

## 🌐 Access the App

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:5000  
- **Swagger:** http://localhost:5000/swagger  

---

## 4. Running Migrations

Database migrations and seed data are automatically applied when the backend container starts.

No manual action is required.

### (Optional) Run manually:

```bash
docker exec -it taskflow-api dotnet ef database update
```

## 🔐 Test Credentials

Use the following credentials to log in immediately:

- **Email:** test@example.com  
- **Password:** password123

## 📡 API Reference

### 🔐 Authentication
- `POST /api/auth/register` → Register a new user  
- `POST /api/auth/login` → Login user  

### 📁 Projects
- `GET /api/projects` → Get all projects  
- `POST /api/projects` → Create a project  
- `GET /api/projects/{id}` → Get project by ID  
- `DELETE /api/projects/{id}` → Delete project  

### ✅ Tasks
- `GET /api/tasks` → Get all tasks  
- `POST /api/tasks` → Create task  
- `PUT /api/tasks/{id}` → Update task  
- `DELETE /api/tasks/{id}` → Delete task  

### 📌 Interactive Docs
- **Swagger UI:**  
  http://localhost:5000/swagger

## 📂 Project Structure

### 🖥️ Backend
- `TaskFlow.Api`  
- `TaskFlow.Models`  
- `TaskFlow.Repository`  
- `TaskFlow.Services`  

### 🌐 Frontend
- `src/`  
- `components/`  
- `hooks/`  
- `contexts/`
- `lib/`
- `styles/`

## 7. What I'd Do With More Time

### 🚀 Improvements
- Implement refresh token flow for secure authentication  
- Add role-based access control (Admin/User roles)  
- Introduce real-time updates (SignalR / WebSockets)  
- Add notifications (email or in-app)  
- Support file attachments in tasks  
- Improve database indexing and query performance  
- Add comprehensive unit and integration tests  
- Implement centralized logging (Grafana / ELK stack)  

### ⚠️ Shortcuts Taken
- Used simple JWT authentication without refresh tokens    
- No real-time synchronization (requires manual refresh)  
- Limited validation in some API endpoints  
- No test coverage implemented  

These tradeoffs were made to focus on delivering a stable and complete MVP within the given time constraints.

---

## ✅ Summary

**TaskFlow** is a production-style full-stack application demonstrating:

- Clean architecture principles  
- Secure authentication  
- RESTful API design  
- Modern frontend practices  
- Docker-based deployment  













