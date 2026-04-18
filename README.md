# MedPlus — Smart Pharmacy Inventory Management 🏥

MedPlus is a full-stack web application designed to help pharmacies easily track inventory, sell medicines with a single click, monitor expiry dates, and **automatically email suppliers** when stock is running low.

This project was built for a hackathon to demonstrate a seamless, production-ready full-stack workflow.

## 🌟 Key Features
- **Live Inventory Dashboard**: See all medicines, stock levels, and expiry statuses in real-time.
- **Smart Sell Button**: One-click selling that instantly updates the database.
- **Automated Low-Stock Alerts**: If you sell a medicine and its stock drops below the safe 'reorder level', the backend **automatically sends an SMTP email** to the supplier to order more!
- **Fast Search**: Instantly find medicines by their brand name or chemical salt.

---

## 🛠️ Technology Stack
- **Frontend**: React.js (built with Vite) + Tailwind CSS + Zustand (State Management)
- **Backend**: Python + FastAPI + SQLAlchemy + BackgroundTasks (for async emails)
- **Database**: PostgreSQL

---

## 🚀 How to Run the Project

To run MedPlus, you need to start both the Python backend and the React frontend in two separate terminal windows.

### 1. Start the Backend (FastAPI)
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the required Python packages (if you haven't already):
   ```bash
   pip install -r requirements.txt
   ```
3. Set up email alerts: Create a file named `.env` inside the `backend` folder with your Google App Password so the automated emailer works:
   ```env
   SMTP_EMAIL=your.email@gmail.com
   SMTP_PASSWORD=your_16_letter_google_app_password
   ```
4. Start the server!
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
   ```

### 2. Start the Frontend (React)
1. Open a **new** terminal and navigate to the frontend code folder:
   ```bash
   cd frontend/smart_pharma/frontend
   ```
2. Install the React packages (first time only):
   ```bash
   npm install
   ```
3. Start the development server!
   ```bash
   npm run dev
   ```
4. Open the link provided in your terminal (usually `http://localhost:5173`) in your browser. 
5. *Note on Login: For the hackathon demo, the login system is mocked. You can log in using **any** random email and password combination!*

---

## 📝 Core API Endpoints

The backend is extremely fast and exposes these core APIs (running on `http://127.0.0.1:8001`):

- `GET /medicines` — Fetches the entire inventory table from PostgreSQL.
- `POST /medicines` — Validates and adds a new medicine.
- `PUT /sell/{id}` — Decreases stock safely. If stock drops below `reorder_level`, it securely triggers the low-stock email.
- `GET /search?q=` — Smart search that cross-references both medicine name and salt.
