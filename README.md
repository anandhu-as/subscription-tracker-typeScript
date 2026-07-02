## Subscription Tracker API
 
A secure, production-ready REST API for managing and tracking user subscriptions — built with TypeScript, JWT authentication, Arcjet rate limiting, and Upstash caching.
 
---x
 
## Tech Stack
 
- **Runtime:** Node.js + TypeScript
- **Auth:** JWT (JSON Web Tokens)
- **Rate Limiting:** [Arcjet](https://arcjet.com)
- **Caching:** [Upstash](https://upstash.com) 
- **Database:** MongoDB (via Mongoose)
---
 
## Workflow
 
### 1. User Registration & Login
 
A new user registers via `POST /api/auth/sign-up`, providing their name, email, and password. Passwords are hashed before storage. On login (`POST /api/auth/sign-in`), the server validates credentials and returns a **JWT access token**.
 
```
Client → POST /api/auth/sign-up → Hash password → Save user → 200 OK
Client → POST /api/auth/sign-in → Validate → Issue JWT → 200 OK + token
```
 
### 2. Authentication Middleware
 
All protected routes require the JWT in the `Authorization: Bearer <token>` header. The middleware decodes and verifies the token on every request, attaching the user identity to `req.user`. Invalid or expired tokens are rejected with `401 Unauthorized`.
 
### 3. Rate Limiting (Arcjet)
 
Every incoming request passes through **Arcjet** before hitting any route handler. Arcjet enforces request limits per IP to prevent abuse and brute-force attacks.
 
```
Request → Arcjet shield → check rate limit
  ├── within limit  → proceed to route handler
  └── over limit    → 429 Too Many Requests
```
 
Default limits (configurable via Arcjet dashboard):
- **10 requests / 10 seconds** per IP on auth routes
- **60 requests / minute** per IP on general API routes
### 4. Subscription CRUD
 
Authenticated users can manage their subscriptions:
 
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subscriptions` | List all subscriptions for the user |
| `POST` | `/api/subscriptions` | Create a new subscription |
| `GET` | `/api/subscriptions/:id` | Get a single subscription |
| `PUT` | `/api/subscriptions/:id` | Update a subscription |
| `DELETE` | `/api/subscriptions/:id` | Delete a subscription |
 
Each subscription stores: name, cost, billing cycle, start date, category, payment method, and status.
 
### 5. Caching (Upstash)
 
Frequently accessed data (e.g. subscription lists) is cached in **Upstash Redis** to reduce database load and improve response times.
 
```
GET /api/subscriptions
  ├── Cache HIT  → return cached response (fast)
  └── Cache MISS → query MongoDB → store in cache → return response
```
 
Cache is invalidated automatically on any write operation (create, update, delete).
 
---
 
## Request Flow (Summary)
 
```
Incoming Request
      │
      ▼
 Arcjet Shield ──── rate limit exceeded? ──► 429
      │
      ▼
 JWT Middleware ─── invalid token? ────────► 401
      │
      ▼
 Upstash Cache ──── cache hit? ────────────► return cached data
      │ (miss)
      ▼
 Route Handler
      │
      ▼
   MongoDB
      │
      ▼
 Update Cache + Return Response
```
 
---
 
## Environment Variables
 
Create a `.env` file in `/server`:
 
```env
PORT=5500
MONGO_URI=your_mongodb_connection_string
 
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
 
ARCJET_KEY=your_arcjet_api_key
 
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```
 
---
 
## Getting Started
 
```bash
# Install dependencies
cd server
npm install
 
# Run in development
npm run dev
 
# Build for production
npm run build
npm start
```
 
---
 
## Rate Limiting Details
 
Rate limiting is handled by **Arcjet** and applied as middleware globally. It protects against:
 
- Brute-force login attempts
- Automated scraping
- API abuse
Arcjet rules are defined in the server config and can be tuned per route. When a client exceeds the limit, they receive:
 
```json
{
  "status": 429,
  "message": "Too many requests. Please try again later."
}
``

 
