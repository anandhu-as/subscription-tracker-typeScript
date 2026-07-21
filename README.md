#  Subscription Tracker API

A production-ready RESTful API for tracking personal subscriptions and automating renewal reminders. Built with Express.js, TypeScript, and MongoDB — with automated email workflows powered by Upstash QStash and Nodemailer.

##  Features

- **JWT Authentication** — Secure user registration and login.
- **Subscription Management** — Add, view, update, and delete subscriptions.
- **Automated Reminders** — Email alerts sent 7, 5, 2, and 1 day(s) before renewal via Upstash workflows.
- **Email Notifications** — Powered by Nodemailer.
- **Rate Limiting & Bot Protection** — Secured via Arcjet.
- **Clean Architecture** — Controllers, routes, middlewares, models, and utilities neatly separated.
- **Environment-aware** — Separate configurations for development and production.

##  Folder Structure

```text
subscription-tracker-typeScript/
├── server/
│   ├── src/
│   │   ├── config/          # Environment variables and configurations
│   │   ├── controllers/     # Request handlers and business logic
│   │   ├── db/              # Database connection setup
│   │   ├── dbmodels/        # Mongoose database models
│   │   ├── middlewares/     # Express middlewares (Auth, Error handling, etc.)
│   │   ├── routes/          # API route definitions
│   │   ├── utilities/       # Helper functions and utilities
│   │   ├── app.ts           # Express app setup
│   │   └── constants.ts     # Global constants
│   ├── .env.development.local # Local dev environment variables
│   ├── .env.production.local  # Production environment variables
│   ├── package.json         # Project metadata and dependencies
│   └── tsconfig.json        # TypeScript configuration
└── README.md
```

##  Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Upstash QStash account (for automated reminders)
- Arcjet account (for rate limiting)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the server directory:
   ```bash
   cd subscription-tracker-typeScript/server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Copy the provided `.env.example` file to create your local environment file:
   ```bash
   cp .env.example .env.development.local
   ```
   Then, open `.env.development.local` and fill in your actual credentials (MongoDB URI, JWT Secret, Upstash Keys, Arcjet Key, etc.).

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **Node.js** & **Express.js**
- **TypeScript**
- **MongoDB** & **Mongoose**
- **Upstash QStash**
- **Arcjet**
- **Nodemailer**
