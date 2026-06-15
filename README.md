# SkillForge (Bi-Free) - Guided Freelancing & Skill Incubation Platform

A modern, enterprise-level EdTech platform that connects students, mentors, faculty, and clients for guided skill development and real-world freelancing experience.

## 🎯 Platform Overview

SkillForge is a comprehensive skill incubation platform designed to help students transition from learning to industry-ready professionals through structured mentorship, monitored assessments, and real-world project experience. The platform supports distinct user roles (Clients, Students, Mentors, Faculty/Admin) and provides specialized dashboards for each.

## ✨ Key Features

- **Multi-Role Ecosystem**: Separate interfaces and workflows for Students, Mentors, Faculty/Staff, and Clients.
- **Skill Level Progression System**: Progressive certification paths (Level A, B, C, D). Achieving an "A grade" unlocks real-world freelance projects.
- **Proctored Online Exams**: Fullscreen exam interface with strict Webcam and Microphone monitoring.
- **Guided Learning**: Structured learning modules, paths, and AI-powered course recommendations.
- **Real-World Projects**: Students work on actual client deliverables under senior mentor supervision.
- **Analytics & Management**: Comprehensive Kanban boards, tracking, metrics, and administrative controls.

## 🛠️ Technology Stack

**Backend**:
- **Framework**: FastAPI (Python)
- **Database**: Relational DB via SQLAlchemy / Alembic (SQLite/PostgreSQL)
- **Auth**: JWT Authentication

**Frontend**:
- **Framework**: React 18 (TypeScript) via Vite
- **Styling**: Tailwind CSS v4, Radix UI
- **State Management**: Zustand
- **Routing**: React Router 7

---

## 🚀 Quick Start Guide

### 1. Starting the Backend (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```powershell
   cd Backend
   .\venv\Scripts\Activate.ps1
   uvicorn app.main:app --reload
   ```
2. The backend will now be running at `http://localhost:8000`
3. Interactive API Docs are available at `http://localhost:8000/docs`

### 2. Starting the Frontend (React / Vite)

1. Open a **second** terminal and navigate to the frontend directory:
   ```powershell
   cd Frontend
   npm run dev
   ```
2. The frontend will now be accessible at `http://localhost:5173`

---

## 🔑 Demo Accounts

Navigate to `http://localhost:5173/login` in your browser. 

The `seed_db.py` script automatically provisions several active demo accounts representing different operational roles. 

> [!IMPORTANT]
> **The global password for all demo accounts is:** `password123`

| Role | Email | Capabilities / View |
| :--- | :--- | :--- |
| **Student (Elite)** | `alex@student.edu` | Level A student with an active project assignment and high trust score. |
| **Student (Junior)**| `junior@student.edu` | Level C student currently in the incubation/learning phase. |
| **Mentor** | `mentor@skillforge.edu` | Senior Mentor with active project allocations and pending code reviews. |
| **Client** | `client@skillforge.edu` | Corporate client with ongoing SaaS projects and budget tracking. |
| **Faculty/Admin** | `faculty@skillforge.edu` | Administrator overseeing the entire ecosystem, metrics, and escalations. |

---

## 🔧 Troubleshooting

- **CORS Errors**: Ensure the backend is running strictly on port `8000`. The frontend Axios client is configured to target `http://localhost:8000/api/v1`.
- **Invalid Email or Password**: If you get a login failure on a fresh setup, it means your database is empty. Stop the backend server, run `python scripts/seed_db.py`, and start it again.
- **Port 8000/5173 Already in Use**: If your servers crash on startup, you likely have zombie processes running. In Windows PowerShell, you can forcefully kill them using:
  ```powershell
  taskkill /F /IM python.exe
  taskkill /F /IM node.exe
  ```
