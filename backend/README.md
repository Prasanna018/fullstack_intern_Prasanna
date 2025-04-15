# 🚀 Fullstack Developer Intern Assignment: Task Management System

Welcome to your Fullstack Developer Internship Assignment! This repository is a **starter template** for building a **Task Management System**. Your focus should be primarily on the **backend**, but a minimal frontend is also required to demonstrate your implementation.

---

## 📌 Assignment Overview

As a Fullstack Intern (Backend-focused), your task is to develop a **Task Management System** that allows users to manage tasks via a RESTful API and receive real-time updates via WebSockets. You’ll use MongoDB for data persistence and Docker for containerization.

---

## 🎯 Objectives

You are expected to:

- [ ] Develop a RESTful API for CRUD operations on tasks
- [ ] Enable real-time task updates via WebSocket
- [ ] Persist tasks using MongoDB with Mongoose
- [ ] Containerize the backend and frontend using Docker and Docker Compose
- [ ] Create a simple frontend to interact with the API and WebSocket
- [ ] Write modular, clean TypeScript code
- [ ] Provide clear documentation and setup instructions

---

## 🛠️ Technologies to Use

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- WebSocket (`ws` library)
- `uuid`, `dotenv`

**Frontend:**
- HTML, Vanilla JavaScript, CSS

**Containerization:**
- Docker
- Docker Compose

---

## 📁 Project Structure


```
task-management-system/
├── backend/
│ ├── src/
│ │ ├── controllers/ # Route controllers
│ │ ├── models/ # MongoDB models
│ │ ├── routes/ # API routes
│ │ ├── sockets/ # WebSocket handlers
│ │ ├── utils/ # Utility functions
│ │ ├── app.ts # Express application
│ │ └── server.ts # HTTP/WebSocket server
│ ├── .env.example # Environment variables template
│ ├── Dockerfile # Backend container config
│ └── package.json
├── frontend/
│ ├── public/ # Static assets
│ ├── src/ # Frontend source code
│ ├── Dockerfile # Frontend container config
│ └── package.json
├── docker-compose.yml # Multi-container setup
└── README.md # Project documentation
```


---

## 🔧 Functional Requirements

### 📡 REST API Endpoints

| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| POST   | `/api/tasks`     | Create a new task          |
| GET    | `/api/tasks`     | Get all tasks              |
| GET    | `/api/tasks/:id` | Get a task by ID           |
| PATCH  | `/api/tasks/:id` | Update task status         |
| DELETE | `/api/tasks/:id` | Delete a task              |

### ⚡ WebSocket Events

| Event        | Description                | Payload                  |
|--------------|----------------------------|--------------------------|
| `task_created` | When a task is created     | New task object          |
| `task_updated` | When a task is updated     | Updated task object      |
| `task_deleted` | When a task is deleted     | `{ id: string }`         |

### 🧾 MongoDB Schema

Each task should include:

- `id` (string, UUID)
- `title` (string)
- `description` (string)
- `status` ("pending" | "completed")
- `createdAt` (Date)

---

## 🖥️ Frontend Requirements

Your frontend should:

- [ ] Display all tasks
- [ ] Create a new task via form
- [ ] Toggle task status (pending/completed)
- [ ] Delete a task
- [ ] Reflect real-time changes using WebSockets

---

## 🧪 Bonus (Optional)

- [ ] Add task filtering (e.g., by status)
- [ ] Implement basic authentication
- [ ] Add task categories or priorities
- [ ] Use Tailwind CSS for styling
- [ ] Write unit tests for backend APIs

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- npm or yarn

### ⚙️ Setup Instructions

1. **Clone the repository (this repo):**

- After accepting the assignment via GitHub Classroom, clone your personal repository to your local machine:
     ```bash
     git clone https://github.com/roguedevs-hq/fullstack-be-intern-your_name.git
     cd fullstack-be-intern-your_name
     ```

2. Create `.env` file in `backend/`:
```
MONGO_URI=mongodb://mongo:27017/taskdb
PORT=5000
```

3. Run the app using Docker Compose:
```bash
docker-compose up --build
```

4. Access in browser:
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api/tasks
```

---

## ✅ Submission Guidelines

### 📌 Steps to Submit

1. **Work on the Assignment:**
   - Implement the backend API, WebSocket integration, and frontend as per the requirements.
   - Commit your changes regularly with meaningful commit messages:
     ```bash
     git add .
     git commit -m "feat: Implemented task creation API"
     git push origin main
     ```

2. **Final Commit:**
   - Before the submission deadline, ensure all your work is committed and pushed to your personal repository.
   - Verify that the latest commit includes all required features and documentation.

3. **Automatic Submission:**
   - No manual submission is required — the system will automatically detect your latest commit.

### 📄 What to Include in Your Repository

Ensure your repository contains the following:

- **Backend:**
  - Fully implemented RESTful API and WebSocket server.
  - Dockerfile and Docker Compose configuration for containerization.
  - `.env` file with necessary environment variables (e.g., `MONGO_URI`, `PORT`)
---

## 🏁 Good Luck!
We look forward to seeing your implementation!

