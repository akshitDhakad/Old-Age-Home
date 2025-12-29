# Home-First Elderly Care Platform - Backend Server

A production-ready Express.js server built with TypeScript, following best practices for scalability, maintainability, and security.

## 🚀 Features

- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **Service-based architecture** with class-based services
- **Comprehensive error handling** with custom error classes
- **JWT authentication** with refresh tokens
- **Request validation** using Zod
- **Security middleware** (Helmet, CORS, Rate Limiting)
- **Type-safe** throughout with TypeScript
- **Optimized** database queries with indexes
- **Graceful shutdown** handling

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration (env, etc.)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware (auth, validation)
│   ├── models/          # Mongoose models
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic (class-based)
│   ├── utils/           # Utilities (errors, helpers)
│   ├── validators/      # Zod validation schemas
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/home-first-care
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
```

## 🚦 Running the Server

```bash
# Development (with hot reload)
npm run dev

# Build
npm run build

# Production
npm start

# Production (with NODE_ENV)
npm run start:prod
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/me` - Get current user (protected)

### Users
- `GET /api/v1/users/profile` - Get current user profile (protected)
- `PATCH /api/v1/users/profile` - Update current user profile (protected)
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID (admin only)

### Caregivers
- `GET /api/v1/caregivers/search` - Search caregivers (public)
- `GET /api/v1/caregivers/:userId` - Get caregiver profile (public)
- `POST /api/v1/caregivers/profile` - Create caregiver profile (caregiver only)
- `GET /api/v1/caregivers/profile/me` - Get my caregiver profile (caregiver only)
- `PATCH /api/v1/caregivers/profile/me` - Update my caregiver profile (caregiver only)
- `PATCH /api/v1/caregivers/:userId/verification` - Update verification status (admin only)

### Bookings
- `POST /api/v1/bookings` - Create booking (protected)
- `GET /api/v1/bookings/me` - Get my bookings (protected)
- `GET /api/v1/bookings/:id` - Get booking by ID (protected)
- `PATCH /api/v1/bookings/:id` - Update booking (protected)
- `POST /api/v1/bookings/:id/cancel` - Cancel booking (protected)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Code Quality

```bash
# Lint
npm run lint

# Format
npm run format
```

## 🏗️ Architecture

### Service Layer Pattern
Business logic is encapsulated in service classes:
- `AuthService` - Authentication and authorization
- `UserService` - User management
- `CaregiverService` - Caregiver profile management
- `BookingService` - Booking management

### Error Handling
- Custom error classes (`AppError`, `BadRequestError`, etc.)
- Global error handler middleware
- Async error wrapper for route handlers

### Database
- Mongoose models with validation
- Indexes for optimized queries
- Connection pooling
- Graceful connection handling

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- JWT token authentication
- Password hashing with bcrypt
- Input validation with Zod
- Rate limiting (configurable)
- Request size limits

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `zod` - Schema validation
- `helmet` - Security headers
- `cors` - CORS middleware
- `compression` - Response compression
- `morgan` - HTTP request logger

### Development
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution
- `eslint` - Linting
- `prettier` - Code formatting

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production.

### Database
Ensure MongoDB is accessible and connection string is correct.

### Process Management
Use PM2 or similar for process management in production:

```bash
pm2 start dist/index.js --name home-first-api
```

## 📄 License

ISC


