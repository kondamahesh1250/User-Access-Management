
# 🧭 User Access Management System

A full-stack application for managing software access requests based on user roles. Built using **Node.js**, **React**, **TypeORM**, and **PostgreSQL**.

---

## 🚀 Features

### 👤 User Roles

- **Employee**: Can sign up, log in, and request access to software.
- **Manager**: Can view, approve, or reject access requests.
- **Admin**: Can create software and manage the system.

### 🔐 Authentication

- JWT-based login system
- Secure password handling with `bcrypt`
- Role-based route protection

### 📦 Core Functionalities

- User Registration and Login
- JWT Authentication and Authorization
- Software Creation (Admin only)
- Access Request Submission (Employee)
- Access Request Management (Manager)

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Auth**: JWT, bcrypt
- **Others**: dotenv, nodemon

---

## 📄 API Endpoints

### 🔐 Auth

- `POST /api/auth/signup` – Register a new user (default role: Employee)
- `POST /api/auth/login` – Log in and receive JWT + role

### 🧩 Software Management (Admin)

- `POST /api/software` – Add new software (name, description, access levels)

### 📝 Access Request (Employee)

- `POST /api/requests` – Submit request (software, access type, reason)

### ✅ Request Approval (Manager)

- `PATCH /api/requests/:id` – Approve or reject an access request

---

## 🖥️ React Frontend Pages

| Path                | Description                    |
|---------------------|--------------------------------|
| `/signup`           | User sign-up form              |
| `/login`            | Login page                     |
| `/create-software`  | Admin creates software         |
| `/request-access`   | Employees submit access requests |
| `/pending-requests` | Managers approve/reject requests |

---

## ⚙️ Setup Instructions

### 🧩 Backend

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   ```env
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/dbname
   JWT_SECRET=your_jwt_secret
   ```
4. Run migrations:
   ```bash
   npm run typeorm migration:run
   ```
5. Start server:
   ```bash
   npm start
   ```

### 🖼️ Frontend

1. Navigate to the frontend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

   user-access-management/
│
├── backend/                  # Express + TypeORM API
│   ├── src/
│   │   ├── entities/         # TypeORM entities (User, Software, Request)
│   │   ├── middleware/       # Auth, role-based access control
│   │   ├── routes/           # Route logic (auth, software, requests)
│   │   ├── data-source       # DB config, env loader      
│   │   └── index.ts          # App entry point
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── api/              # ProtectedRoute, App routing
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── vite.config.ts (or webpack.config.js)
│   └── package.json
│
└──README.md




