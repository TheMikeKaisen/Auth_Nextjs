
# 🔐 Authentication System | Next.js 

Welcome to my "Learn in Public" authentication project. This repository demonstrates an enterprise-grade, full-stack authentication system built with Next.js (App Router), focusing on high security, seamless UX, and strict architectural boundaries.

## ✨ Key Features

* **Clean Architecture:** Strict separation of concerns across Controllers (API Routes), Business Logic (Services), and Data Access (Repositories).
* **Advanced Session Security:** Dual-token system (Access + Refresh tokens) with **Refresh Token Rotation** and **Reuse Detection** to mitigate token theft.
* **Edge Middleware:** Instant, server-side route protection preventing unauthorized access and infinite redirect loops.
* **Type Safety & Validation:** End-to-end type safety with TypeScript and rigorous payload validation using Zod.
* **Automated Testing:** Unit and integration test coverage using Jest, utilizing dependency mocking for isolated, deterministic results.

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Database:** MySQL (via `mysql2/promise` pool)
* **Infrastructure:** Docker (for isolated database containerization)
* **Authentication:** `jose` (Edge-compatible JWTs), `bcryptjs`
* **Testing:** Jest

---

## 📂 Folder Structure

The project strictly follows domain-driven Clean Architecture principles:

```text
src/
├── app/                      # Next.js App Router (UI and API Controllers)
│   ├── api/auth/             # Authentication API Controllers
│   ├── dashboard/            # Protected Server Component views
│   └── page.tsx              # Public/Redirect routes
├── constants/                # Centralized single source of truth (routes, cookies)
├── features/                 # Domain-driven feature modules
│   └── auth/
│       ├── components/       # Client-side React components (Forms, Buttons)
│       ├── repositories/     # Data Access Layer (Raw SQL queries)
│       ├── services/         # Business Logic Layer (Token generation, validation)
│       └── validations/      # Zod schemas for request validation
├── lib/                      # Cross-cutting utilities (DB client, Env validation, JWT)
└── middleware.ts             # Edge runtime route protection

```

---

## Getting Started

Follow these steps to run the application and the testing suite locally.

### 1. Prerequisites

* Node.js (v18+)
* Docker & Docker Compose

### 2. Clone the Repository

```bash
git clone https://github.com/TheMikeKaisen/Auth_Nextjs
cd Auth_Nextjs
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure your secrets. The app uses strict boot-time validation, so it will not start if these are missing.

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/your_db_name"
JWT_SECRET="generate_a_very_long_random_secure_string_here_min_32_chars"
NODE_ENV="development"

```

### 4. Database Setup (Docker)

Spin up the isolated MySQL database container.

```bash
docker compose up -d

```

Execute the following SQL commands in your MySQL container to create the necessary tables:

```sql
CREATE TABLE user_account (
    id VARCHAR(191) PRIMARY KEY,
    full_name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(191) NOT NULL,
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE refresh_token (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

```

### 5. Run the Application

Start the Next.js development server.

```bash
npm run dev

```

Navigate to `http://localhost:3000`. You will be automatically intercepted by the middleware and routed to the secure `/login` portal.

### 6. Run the Test Suite

Run the Jest automated testing suite to verify the business logic and API controllers.

```bash
npm run test

```

