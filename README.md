# 🚀 Project Management SaaS

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-brightgreen)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Redis](https://img.shields.io/badge/Redis-Cache-red)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue)

A full-stack **Project Management SaaS** application designed to help organizations manage projects, teams, and tasks efficiently.

Built using Java, Spring Boot, React, TypeScript, and PostgreSQL, this application provides secure authentication, role-based access control, and an interactive Kanban board for efficient project collaboration.

## ✨ Features

- 🔐 JWT-based user authentication
- 🛡️ Role-Based Access Control (RBAC)
- 🏢 Organization and project management
- 📋 Interactive Kanban board
- 🎯 Task status and priority management
- 🔎 Task search and filtering
- 🗄️ PostgreSQL database integration
- ⚡ Redis caching
- 🐳 Docker containerization
- 🔄 GitHub Actions CI/CD pipeline
- ☁️ Cloud deployment support

## 🛠️ Technology Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication

### Database & Infrastructure
- PostgreSQL
- Redis
- Docker
- Docker Compose
- GitHub Actions

### Deployment
- Render (Backend)
- Vercel (Frontend)

## 🏗️ System Architecture

The application follows a frontend-backend architecture.

- **React Frontend:** Provides the user interface and communicates with the backend through REST APIs.
- **Spring Boot Backend:** Handles business logic, authentication, authorization, and API requests.
- **PostgreSQL:** Stores users, organizations, projects, and tasks.
- **Redis:** Provides caching to improve application performance.
- **Docker Compose:** Manages the application services and local development environment.

## 📂 Project Structure

```text
project-management-saas/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Git
- Docker Desktop
- Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/MaheeshaPaboth/project-management-saas.git
```

```bash
cd project-management-saas
```

### 2. Configure Environment Variables

Create a `.env` file using the example configuration:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Update the environment variables in `.env` according to your local configuration.

**Important:** Never commit your `.env` file or expose database passwords, JWT secrets, or API keys.

### 3. Start the Application

Build and start all services using Docker Compose:

```bash
docker compose up -d --build
```

### 4. Access the Application

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |

### 5. Stop the Application

```bash
docker compose down
```

To stop the application and remove containers and volumes:

```bash
docker compose down -v
```

**Warning:** The `-v` option removes persistent database and Redis volumes, including stored data.

## 📸 Screenshots

### 1. Authentication (JWT Login)

Secure sign-in interface supporting JSON Web Tokens (JWT) and role-based session handling.

![Authentication](screenshots/Screenshot%202026-11-07%20005435.png)

### 2. Project Dashboard

Overview of projects belonging to the organization with quick access to boards.

![Project Dashboard](screenshots/Screenshot%202026-11-07%20005501.png)

### 3. Create New Project

Modal interface allowing users to seamlessly provision new projects.

![Create New Project](screenshots/Screenshot%202026-11-07%20005622.png)

### 4. Interactive Kanban Board

Full task management lifecycle across columns (**To Do**, **In Progress**, **Review**, **Done**) with instant status transitions, search, and priority filters.

![Kanban Board](screenshots/Screenshot%202026-11-07%20005537.png)

---

## 🌐 Live Demo

- **Frontend (Vercel):** [https://project-management-saas-flax.vercel.app](https://project-management-saas-flax.vercel.app)
- **Backend API (Render):** https://<your-render-service-name>.onrender.com
- **Swagger / API Docs:** https://<your-render-service-name>.onrender.com/swagger-ui/index.html

## 👨‍💻 Developer

**Maheesha Paboth Adikari**

Information Technology Undergraduate  
University of Moratuwa, Sri Lanka

Interested in Software Engineering, Full-Stack Development, Backend Engineering, and Cloud Technologies.

Currently seeking a Software Engineering Internship.

- **LinkedIn:** [Maheesha Paboth](https://www.linkedin.com/in/maheesha-paboth-23549a2b5/)
- **GitHub:** [MaheeshaPaboth](https://github.com/MaheeshaPaboth)
- **Email:** [maheesha1111@gmail.com](mailto:maheesha1111@gmail.com)

## 📄 License

This project was developed for educational and portfolio purposes.
