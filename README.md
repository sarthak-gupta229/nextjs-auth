# 🔐 Next.js Authentication — JWT + Bcrypt + MongoDB

A full-stack authentication system built with **Next.js 16 (App Router)**, showcasing industry-standard security practices using **JWT**, **Bcrypt**, **MongoDB**, and **Nodemailer** for email verification.

---

## 📚 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How Authentication Works](#how-authentication-works)
  - [Signup Flow](#1-signup-flow)
  - [Email Verification Flow](#2-email-verification-flow)
  - [Login Flow](#3-login-flow)
  - [Protected Routes & Middleware](#4-protected-routes--middleware)
  - [Profile & Token Extraction](#5-profile--token-extraction)
  - [Logout Flow](#6-logout-flow)
- [API Routes](#api-routes)
- [Key Concepts Explained](#key-concepts-explained)
  - [Password Hashing with Bcrypt](#password-hashing-with-bcrypt)
  - [JWT (JSON Web Tokens)](#jwt-json-web-tokens)
  - [HttpOnly Cookies](#httponly-cookies)
  - [Middleware Route Protection](#middleware-route-protection)
- [Database — MongoDB & Mongoose](#database--mongodb--mongoose)
- [Email — Nodemailer + Mailtrap](#email--nodemailer--mailtrap)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

---

## Overview

This project is a **production-ready authentication boilerplate** that demonstrates:

- ✅ User **Signup** with password hashing
- ✅ **Email Verification** via tokenized links
- ✅ Secure **Login** with JWT issued into an HttpOnly cookie
- ✅ **Route protection** via Next.js Middleware
- ✅ **Profile page** that reads user data from a protected API
- ✅ **Logout** by clearing the auth cookie

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Full-stack React framework — pages + API routes |
| **TypeScript** | Type safety across the entire codebase |
| **MongoDB + Mongoose** | NoSQL database & schema modeling |
| **Bcryptjs** | Password hashing & token hashing |
| **JSON Web Tokens (JWT)** | Stateless auth tokens |
| **Nodemailer** | Sending verification/reset emails |
| **Mailtrap** | SMTP sandbox for email testing |
| **Tailwind CSS v4** | Utility-first styling |
| **React Hot Toast** | Toast notifications |
| **Lucide React** | Icon library |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing / Home page
│   ├── login/page.tsx              # Login UI
│   ├── signup/page.tsx             # Signup UI
│   ├── verifyemail/page.tsx        # Email verification UI
│   ├── profile/
│   │   ├── page.tsx                # Redirects to /profile/[id]
│   │   └── [id]/page.tsx           # User profile display page
│   └── api/users/
│       ├── signup/route.ts         # POST  — Register new user
│       ├── login/route.ts          # POST  — Authenticate & issue JWT
│       ├── logout/route.ts         # GET   — Clear auth cookie
│       ├── me/route.ts             # GET   — Get current user from token
│       └── verifyemail/route.ts    # POST  — Verify email token
├── dbConfig/
│   └── dbConfig.ts                 # MongoDB connection setup
├── helpers/
│   ├── getDataFromToken.ts         # Extract user ID from JWT cookie
│   └── mailer.ts                   # Send verification / reset emails
├── models/
│   └── userModel.ts                # Mongoose User schema
└── middleware.ts                   # Route guard — redirects unauthenticated users
```

---

## How Authentication Works

### 1. Signup Flow

```
User fills form  →  POST /api/users/signup
                          │
                    Check if email exists
                          │
                    Hash password with bcrypt (salt rounds: 10)
                          │
                    Save new User to MongoDB
                          │
                    Hash userId → store as verifyToken (expires in 1hr)
                          │
                    Send verification email via Nodemailer
                          │
                    Return 201 success response
```

**Key file:** `src/app/api/users/signup/route.ts`

```ts
const salt = await bcryptjs.genSalt(10);
const hashedPassword = await bcryptjs.hash(password, salt);
// Password is NEVER stored in plaintext
```

---

### 2. Email Verification Flow

When a user signs up, a verification email is sent containing a link:

```
https://yourdomain.com/verifyemail?token=<hashedToken>
```

The `verifyemail` page reads the token from the URL and calls:

```
POST /api/users/verifyemail  { token }
         │
   Find user where verifyToken === token AND verifyTokenExpiry > now
         │
   Set isEmailVerified = true
         │
   Clear verifyToken + verifyTokenExpiry from DB
         │
   Return success
```

> The token itself is a **bcrypt hash of the MongoDB `_id`**, stored temporarily on the user document with a 1-hour expiry.

**Key file:** `src/app/api/users/verifyemail/route.ts`

---

### 3. Login Flow

```
User submits email + password  →  POST /api/users/login
                                          │
                                   Find user by email in MongoDB
                                          │
                                   bcrypt.compare(inputPassword, storedHash)
                                          │ (matches)
                                   Build JWT payload: { id, username, email }
                                          │
                                   Sign JWT with TOKEN_SECRET (expires in 1 day)
                                          │
                                   Set JWT in HttpOnly cookie named "token"
                                          │
                                   Return 200 Login successful
```

**Key file:** `src/app/api/users/login/route.ts`

```ts
const tokenData = { id: user._id, username: user.username, email: user.email };
const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });
response.cookies.set('token', token, { httpOnly: true });
```

---

### 4. Protected Routes & Middleware

The Next.js **Middleware** (`src/middleware.ts`) runs on every matched route **before** the page renders. It checks for the `token` cookie and enforces access rules:

```
Request arrives at matched route
          │
    Read "token" cookie from request
          │
    ┌─────┴──────┐
  Has token?   No token?
    │              │
  Is public?    Is public?
  (login/signup) (login/signup)
    │              │
   YES            YES  → Allow through
    │              │
   NO             NO   → Redirect to /login
    │
  Redirect to /   (logged-in user on login/signup → redirect to home)
```

**Matched routes** (configured via `config.matcher`):

- `/` — Home
- `/profile` — Profile redirect
- `/login` — Login page
- `/signup` — Signup page
- `/verifyemail` — Email verification page

**Key file:** `src/middleware.ts`

---

### 5. Profile & Token Extraction

The `/profile` page calls `GET /api/users/me`, which:

1. Reads the `token` cookie from the incoming request
2. Verifies and decodes it using `jwt.verify(token, TOKEN_SECRET)`
3. Extracts the `userId` from the decoded payload
4. Queries MongoDB for that user (`-password` excluded)
5. Returns the user object

Then the profile page redirects to `/profile/[id]` and displays the user's `username`, `email`, and MongoDB `_id`.

**Key files:**
- `src/helpers/getDataFromToken.ts` — JWT decode utility
- `src/app/api/users/me/route.ts` — Protected user endpoint
- `src/app/profile/[id]/page.tsx` — Profile display

---

### 6. Logout Flow

```
User clicks Logout  →  GET /api/users/logout
                               │
                        Set "token" cookie to ""
                        with expiry in the past (new Date(0))
                               │
                        Cookie is deleted by the browser
                               │
                        Redirect to /login
```

**Key file:** `src/app/api/users/logout/route.ts`

---

## API Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|---|
| `POST` | `/api/users/signup` | ❌ | Register a new user |
| `POST` | `/api/users/login` | ❌ | Login and receive JWT cookie |
| `GET` | `/api/users/logout` | ✅ | Clear the auth cookie |
| `GET` | `/api/users/me` | ✅ | Get the currently logged-in user |
| `POST` | `/api/users/verifyemail` | ❌ | Verify email with token from link |

---

## Key Concepts Explained

### Password Hashing with Bcrypt

Passwords are **never stored in plaintext**. Bcrypt is a one-way hashing algorithm designed to be slow (deliberately computationally expensive), making brute-force attacks infeasible.

```ts
// Signup — hashing
const salt = await bcryptjs.genSalt(10); // cost factor = 10
const hashedPassword = await bcryptjs.hash(password, salt);

// Login — verification
const validPassword = await bcryptjs.compare(inputPassword, storedHash);
```

> A **salt** is random data added before hashing, ensuring two identical passwords produce different hashes — defeating rainbow table attacks.

---

### JWT (JSON Web Tokens)

A JWT is a compact, URL-safe token with three base64-encoded parts separated by dots:

```
eyJhbGci...  .  eyJpZCI6IjY4...  .  SflKxwRJSMeK...
   Header         Payload (claims)      Signature
```

In this project:
- The **payload** holds `{ id, username, email }`
- It is signed with `TOKEN_SECRET` so the server can verify authenticity
- It expires after **1 day**
- The client **never sees the raw token** — it lives in an HttpOnly cookie

```ts
jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });
jwt.verify(token, process.env.TOKEN_SECRET!); // throws if invalid or expired
```

---

### HttpOnly Cookies

Setting the JWT in an `HttpOnly` cookie (instead of `localStorage`) means:

- ✅ **JavaScript on the page cannot read it** — prevents XSS (Cross-Site Scripting) attacks from stealing tokens
- ✅ Automatically sent with every same-origin request by the browser
- ✅ The server fully controls the cookie lifecycle (set, clear, expire)

```ts
response.cookies.set('token', token, { httpOnly: true });
```

---

### Middleware Route Protection

Next.js Middleware runs at the **Edge runtime** (before the request hits the page or API). This means users are redirected instantly without waiting for a full page render — it is both secure and fast.

The middleware uses a simple cookie presence check. No database query is needed here because:
1. The cookie is `httpOnly` — tamper-proof from the browser
2. The actual JWT verification happens inside the protected API routes

---

## Database — MongoDB & Mongoose

### Connection

The `connect()` function in `src/dbConfig/dbConfig.ts` establishes a Mongoose connection to MongoDB Atlas (or a local instance). It is called at the top of each API route file to ensure the DB is ready before handling requests.

### User Schema (`src/models/userModel.ts`)

| Field | Type | Description |
|---|---|---|
| `username` | `String` (unique, indexed) | Display name |
| `email` | `String` (unique) | Login identifier |
| `password` | `String` | Bcrypt-hashed password |
| `isEmailVerified` | `Boolean` | Whether email has been confirmed |
| `isAdmin` | `Boolean` | Admin flag |
| `verifyToken` | `String` | Temporary email verification token |
| `verifyTokenExpiry` | `Date` | Token expiry (1 hour from creation) |
| `forgotPasswordToken` | `String` | Temporary password reset token |
| `forgotPasswordTokenExpiry` | `Date` | Token expiry (1 hour from creation) |
| `avatar` | `Object` | User avatar `{ url, localPath }` |

---

## Email — Nodemailer + Mailtrap

Email is sent via **Nodemailer** using **Mailtrap** as the SMTP sandbox — perfect for development, as emails are captured and never delivered to real inboxes.

The `sendEmail` helper (`src/helpers/mailer.ts`) supports two email types:

- **`VERIFY`** — Sends a link to verify the user's email on signup
- **`RESET`** — Sends a password reset link (infrastructure ready for future use)

How the verification token is created:

1. The user's MongoDB `_id` (a string) is **hashed with bcrypt** (10 rounds)
2. That hash is stored as `verifyToken` on the user document
3. `verifyTokenExpiry` is set to `Date.now() + 3600000` (1 hour)
4. The hash is embedded in the verification email URL
5. On verification, the token is matched and then cleared from the document

---

## Environment Variables

Create a `.env` file at the project root with the following variables:

```env
# MongoDB connection string (Atlas or local)
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# Secret key for signing JWTs — use a long random string in production
TOKEN_SECRET=your_super_secret_jwt_key_here

# Your app base domain (used in email verification links)
DOMAIN=http://localhost:3000

# Mailtrap SMTP credentials — get these from https://mailtrap.io
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB running)
- A [Mailtrap](https://mailtrap.io/) free account for email testing

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd auth-next.js

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in your values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## Auth Flow Diagram

```
┌─────────────┐    POST /signup     ┌───────────────────────┐
│   Signup UI │───────────────────▶ │ Hash password (bcrypt) │
└─────────────┘                     │ Save User to MongoDB   │
                                    │ Send verification email│
                                    └──────────┬────────────┘
                                               │ email with token link
                                               ▼
┌──────────────────┐  POST /verifyemail  ┌──────────────────────┐
│VerifyEmail Page  │───────────────────▶ │ Match verifyToken     │
└──────────────────┘                     │ isEmailVerified = true│
                                         └──────────────────────┘

┌──────────┐   POST /login    ┌──────────────────────────────────┐
│ Login UI │────────────────▶ │ bcrypt.compare(password, hash)   │
└──────────┘                  │ jwt.sign → set HttpOnly cookie   │
                              └────────────────┬─────────────────┘
                                               │ "token" cookie set
                                               ▼
┌───────────────┐   GET /api/users/me   ┌──────────────────────────┐
│  Profile Page │─────────────────────▶ │ Read & verify JWT cookie  │
└───────────────┘                       │ Fetch user from MongoDB   │
                                        │ Return user (no password) │
                                        └──────────────────────────┘

┌──────────────┐   GET /logout   ┌──────────────────────────────┐
│ Logout Button│───────────────▶ │ Expire "token" cookie         │
└──────────────┘                 │ Browser clears cookie         │
                                 │ Redirect to /login            │
                                 └──────────────────────────────┘
```

---

> Built with ❤️ using Next.js, TypeScript, and modern web security practices.
