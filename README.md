# User Management System

A full-stack application for managing users with authentication and authorization.

## Tech Stack

### Backend
- Node.js with Express
- MySQL database
- JWT authentication
- bcrypt for password hashing
- express-validator for input validation

### Frontend
- React 18
- Axios for API calls
- Context API for state management

## Project Structure

```
code-review-exercise/
├── backend/                 # Node.js/Express API
│   ├── db/                 # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── routes/            # API routes
│   ├── .env.example       # Environment variables template
│   ├── package.json
│   └── server.js          # Entry point
│
└── frontend/               # React application
    ├── public/
    ├── src/
    │   ├── components/    # React components
    │   ├── contexts/      # Context providers
    │   ├── services/      # API service layer
    │   └── App.js         # Main app component
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database credentials and JWT secret

5. Create database and users table:
   ```sql
   CREATE DATABASE user_management;
   
   USE user_management;
   
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     name VARCHAR(255) NOT NULL,
     role ENUM('user', 'admin') DEFAULT 'user',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

6. Start the server:
   ```bash
   npm start
   ```

   The API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Users (Protected)
- `GET /api/users` - Get all users (with optional search)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Features

- ✅ User authentication with JWT
- ✅ Role-based authorization (user/admin)
- ✅ Protected API endpoints
- ✅ Input validation
- ✅ Password hashing with bcrypt
- ✅ Search functionality
- ✅ Responsive UI
- ✅ Error handling

## Security Features

- Parameterized SQL queries (prevents SQL injection)
- JWT token expiration
- Password hashing
- Input validation and sanitization
- Environment-based configuration
- Role-based access control

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## License

MIT

