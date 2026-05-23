

## 1. Starting the Backend (FastAPI)



1. Open a new terminal and navigate to the backend directory:
   ```powershell
   cd Backend
  .\venv\Scripts\Activate.ps1
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
