# SkillForge Full-Stack Run Guide

Welcome to the SkillForge Enterprise Learning & Operations Platform. This guide explains how to spin up the local development environment, seed the database with realistic demo data, and access the application.

---

## Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **MySQL/PostgreSQL** (Running locally and configured in your `.env` file)

---

## 1. Starting the Backend (FastAPI)

The backend powers the APIs, authentication, and database interactions.

1. Open a new terminal and navigate to the backend directory:
   ```powershell
   cd Backend
   ```
2. Activate your virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   *(On Mac/Linux: `source venv/bin/activate`)*

3. Ensure your dependencies are up to date:
   ```powershell
   pip install -r requirements.txt
   ```

4. **(Optional but Recommended)** Apply the latest database migrations:
   ```powershell
   alembic upgrade head
   ```

5. **CRITICAL: Seed the Database**
   This script resets the database, clearing out old data, and seeds it with a realistic, relational ecosystem (domains, projects, mentors, students).
   ```powershell
   python scripts/seed_db.py
   ```
   > [!WARNING]
   > The seed script is destructive and will truncate existing tables. It has safety checks preventing it from running in a production environment.

6. Start the FastAPI development server:
   ```powershell
   uvicorn app.main:app --reload
   ```
   *The backend will now be running at `http://localhost:8000`*
   *Interactive API Docs are available at `http://localhost:8000/docs`*

---

## 2. Starting the Frontend (React / Vite)

The frontend is a React Single Page Application (SPA) styled with TailwindCSS and powered by Zustand state management.

1. Open a **second** terminal and navigate to the frontend directory:
   ```powershell
   cd Frontend
   ```
2. Install the necessary node modules (if you haven't already):
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   *The frontend will now be accessible at `http://localhost:5173`*

---

## 3. Accessing the Platform

Navigate to `http://localhost:5173/login` in your browser. 

The `seed_db.py` script automatically provisions several active demo accounts representing different operational roles. 

> [!IMPORTANT]
> **The global password for all demo accounts is:** `password123`

### Demo Accounts

| Role | Email | Capabilities / View |
| :--- | :--- | :--- |
| **Student (Elite)** | `alex@student.edu` | Level A student with an active project assignment and high trust score. |
| **Student (Junior)**| `junior@student.edu` | Level C student currently in the incubation/learning phase. |
| **Mentor** | `mentor@skillforge.edu` | Senior Mentor with active project allocations and pending code reviews. |
| **Client** | `client@skillforge.edu` | Corporate client with ongoing SaaS projects and budget tracking. |
| **Faculty/Admin** | `faculty@skillforge.edu` | Administrator overseeing the entire ecosystem, metrics, and escalations. |

---

## Troubleshooting

- **CORS Errors**: Ensure the backend is running on port `8000`. The frontend Axios client (`api.client.ts`) is hardcoded to target `http://localhost:8000/api/v1`.
- **Invalid Email or Password**: If you get a login failure on a fresh setup, it means your database is empty. Stop the backend server, run `python scripts/seed_db.py`, and start it again.
- **Port 8000/5173 Already in Use**: If your servers crash on startup, you likely have zombie processes running. In Windows PowerShell, you can kill them using:
  ```powershell
  taskkill /F /IM python.exe
  taskkill /F /IM node.exe
  ```
