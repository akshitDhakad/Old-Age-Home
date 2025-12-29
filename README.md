# Home-First Elderly Care Platform

A full-stack application for connecting families with verified caregivers, offering short-term care services, device rentals, subscriptions, and telehealth integration.

## 🏗️ Project Structure

```
.
├── client/          # React + TypeScript frontend
├── server/          # Express.js + MongoDB backend
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- MongoDB (local or cloud instance)
- npm, yarn, or pnpm

### Backend Setup

```bash
cd server
npm install
cp env.example.txt .env
# Edit .env with your MongoDB URI and JWT secrets
npm run dev
```

Backend runs on `http://localhost:4000`

### Frontend Setup

```bash
cd client
npm install
# Create .env file with: VITE_API_BASE=http://localhost:4000
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📚 Documentation

- **Backend**: See `server/README.md`
- **Frontend**: See `client/README.md` and `client/BACKEND_INTEGRATION.md`
- **API**: RESTful API at `/api/v1`

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- React Query (TanStack Query)
- React Hook Form + Zod
- Tailwind CSS
- React Router

### Backend
- Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation
- Helmet (Security)
- Rate Limiting

## 🔐 Environment Variables

### Backend (`server/.env`)
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/home-first-care
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`client/.env`)
```env
VITE_API_BASE=http://localhost:4000
VITE_ENV=development
```

## 📦 Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Lint code

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Lint code

## 🧪 Testing

### Backend
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

## 📝 API Endpoints

- `/api/v1/auth/*` - Authentication
- `/api/v1/users/*` - User management
- `/api/v1/caregivers/*` - Caregiver operations
- `/api/v1/bookings/*` - Booking management

See `server/README.md` for detailed API documentation.

## 🏛️ Architecture

- **Service Layer Pattern**: Business logic in service classes
- **Repository Pattern**: Database operations abstracted
- **RESTful API**: Standard HTTP methods and status codes
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized error handling
- **Validation**: Zod schemas for runtime validation

## 📄 License

ISC

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📧 Support

For issues and questions, please open an issue on GitHub.


