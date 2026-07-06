 Subscription Tracker API

A production-ready RESTful API for tracking personal subscriptions and automating renewal reminders. Built with Express.js, TypeScript, and MongoDB — with automated email workflows powered by Upstash QStash and Nodemailer.

 Features

 JWT Authentication — secure user registration and login
 Subscription Management — add, view, update, and delete subscriptions
 Automated Reminders — email alerts sent 7, 5, 2, and 1 day(s) before renewal via Upstash workflows
 Email Notifications —  Nodemailer
 Rate Limiting & Bot Protection —  Arcjet
 Clean Architecture — controllers, routes, middlewares, models, and utilities neatly separated
 Environment-aware — separate configs for development and production

folder structure

 server/
├── src/
│   ├── app.ts              # Express app setup
│   ├── constants.ts        # App-wide constants
│   ├── config/             # DB connection & environment config
│   ├── controllers/        # Route handler logic
│   ├── routes/             # API route definitions
│   ├── dbmodels/           # Mongoose schemas & models
│   ├── middlewares/        # Auth & error handling middleware
│   └── utilities/          # Helper functions (email, workflow, etc.)
├── dist/                   # Compiled JavaScript output
├── tsconfig.json
├── package.json
├── .env.development.local
└── .env.production.local


for .env.development.local

# Server
PORT=5500
NODE_ENV=development
SERVER_URL=http://localhost:5500

# MongoDB
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d

# Nodemailer
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Upstash QStash
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token

# Arcjet
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

for .env.production.local
# Upstash QStash
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key
