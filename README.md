# Node.js Prisma Modular Production Template

A production-ready, highly scalable Node.js boilerplate using **Express**, **Prisma ORM**, **PostgreSQL**, and **Redis**. This template follows a **Modular Pattern** where each feature is self-contained.

---

## 🚀 Tech Stack
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** Passport.js (JWT Strategy)
- **Validation:** Zod
- **Logging:** Winston & Morgan
- **Storage:** Local Disk / AWS S3 (Flexible Switch)
- **Process Management:** PM2

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v16+)
- PostgreSQL Server
- Redis Server (Optional, but recommended)

### 2. Installation
```powershell
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your credentials:
```env
PORT=8000
DATABASE_URL="postgresql://postgres:password@localhost:5432/music?schema=public"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
STORAGE_MODE=local # or 's3'
```

### 4. Database Setup & Migration
Sync your PostgreSQL database with the Prisma schema:
```powershell
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Seeding (Create Super Admin)
To create the first **SUPERADMIN** user (`admin@example.com` / `admin123`):
```powershell
npm run seed
```

---

## 🏃 Running the Server

### Development Mode (with Nodemon)
```powershell
npm run dev
```

### Production Mode (with PM2)
```powershell
pm2 start ecosystem.config.json
```

---

## 📁 Project Structure (Modular)
```text
src/
 ├── config/         # App configurations (Redis, Passport, Logger)
 ├── middlewares/    # Custom Express middlewares (Auth, Error, Upload)
 ├── modules/        # Feature-based modules (Auth, User, AboutUs)
 │    ├── auth/      # Controller, Service, Route, Validation for Auth
 │    └── user/      # Controller, Service, Route, Validation for User
 ├── routes/v1/      # Route registration index
 ├── utils/          # Helper functions (Pick, Paginate, Seeder)
 └── app.js          # Express app initialization
```

---

## 🔌 API Endpoints

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register (No tokens returned) | `{"email", "password", "fullName"}` |
| **POST** | `/verify-email` | Verify OTP & Get Tokens | `{"email", "code"}` (6-digit OTP) |
| **POST** | `/login` | Standard Login | `{"email", "password"}` |
| **POST** | `/forgot-password` | Send Reset OTP to Email | `{"email"}` |
| **POST** | `/reset-password` | Reset Pass with OTP | `{"email", "password"}` |
| **POST** | `/change-password`| Update Password (Auth) | `{"oldPassword", "newPassword"}` |
| **POST** | `/logout` | Blacklist Refresh Token | `{"refreshToken"}` |
| **POST** | `/refresh-tokens` | Get new Access Token | `{"refreshToken"}` |

### 2. User Management (`/api/v1/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/self/in` | Get Logged-in Profile | **Common** |
| **PATCH** | `/self/update` | Update Profile (w/ Image) | **Common** (Form-Data) |
| **GET** | `/` | List all Users (Admin) | **getUsers** |
| **POST** | `/` | Create new Admin/User | **manageUsers** |
| **GET** | `/:userId` | Get user by ID | **getUsers** |
| **PATCH** | `/:userId` | Update user by ID | **manageUsers** |
| **DELETE** | `/:userId` | Soft delete user | **manageUsers** |

### 3. CMS Modules (`/api/v1/about-us`, `/privacy-policies`, etc.)
- **GET** `/`: Get content (Public)
- **POST** `/`: Create content (Admin)
- **PATCH** `/:id`: Update content (Admin)

---

## 🔍 Monitoring & Docs
- **Swagger Documentation:** `http://localhost:8000/api/v1/docs`
- **Health Check:** `http://localhost:8000/api/v1/health`
- **Logs:** Check `app.log` in the root folder.

---

## 🛡️ Security Features
- **RBAC:** USER, ADMIN, SUPERADMIN hierarchy.
- **Rate Limiting:** Protects `/auth` endpoints from brute force.
- **Data Protection:** Helmet (Security Headers) and XSS Sanitization.
- **Soft Delete:** Users are marked `isDeleted: true` instead of physical deletion.
