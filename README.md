# Backend JWT Auth and MongoDB

## Features

  - **JWT Authentication**: Secure login/signup with JWT tokens
  - **Role-based Access**: Manager, Team Lead, and Executive roles
  - **Reference ID Validation**: Users must provide correct reference IDs to sign up
  - **MongoDB Integration**: Using Mongoose for data modeling
  - **Security**: Helmet, rate limiting, data sanitization, and more
  - **Error Handling**: Comprehensive error handling with custom error classes

## Project Structure

```
project-root/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── teamController.js
│   │   ├── projectController.js
│   │   ├── dashboardController.js
│   │   ├── reviewController.js
│   │   ├── reportController.js
│   │   ├── salaryController.js
│   │   ├── receivedDataController.js
│   │   ├── tlReviewController.js
│   │   ├── executiveController.js
│   │   └── errorController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── Project.js
│   │   ├── Review.js
│   │   ├── ReceivedData.js
│   │   └── TLReview.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── salaryRoutes.js
│   │   ├── receivedDataRoutes.js
│   │   ├── tlReviewRoutes.js
│   │   └── executiveRoutes.js
│   ├── utils/
│   │   ├── appError.js
│   │   └── catchAsync.js
│   ├── config/
│   │   └── database.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── .env
└── README.md
```

## Setup Instructions

### 1\. Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

MANAGER_SIGNUP_REFID=manager
TEAM_LEAD_SIGNUP_REFID=teamlead
EXECUTIVE_SIGNUP_REFID=executive
```

### 2\. Backend Setup

```bash
# Install backend dependencies
npm install

# Start the backend server
npm run dev
```

## API Endpoints

### Authentication

  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/auth/logout` - User logout

### Users (Protected)

  - `GET /api/users/me` - Get current user
  - `PATCH /api/users/updateMe` - Update current user
  - `DELETE /api/users/deleteMe` - Delete current user

### Users (Manager Only)

  - `GET /api/users` - Get all users
  - `POST /api/users` - Create new user
  - `GET /api/users/:id` - Get user by ID
  - `PATCH /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user

### Teams (Protected)

  - `GET /api/teams` - Get all teams
  - `POST /api/teams` - Create team (Manager only)
  - `GET /api/teams/:id` - Get team by ID
  - `PATCH /api/teams/:id` - Update team
  - `DELETE /api/teams/:id` - Delete team
  - `PATCH /api/teams/:id/add-member` - Add team member

## Role-based Access

### Reference IDs for Signup:

  - **Manager**: Use `manager`
  - **Team Lead**: Use `teamlead`
  - **Employee/Executive**: Use `executive`

### Permissions:

  - **Manager**: Can create/manage users and teams
  - **Team Lead**: Can view teams and manage assigned team members
  - **Executive**: Basic access to their profile and assigned teams

## Security Features

  - Password hashing with bcrypt
  - JWT token authentication
  - Rate limiting
  - Data sanitization against NoSQL injection
  - XSS protection
  - HTTP security headers with Helmet
  - CORS configuration

## Dependencies

### Backend

  - Express.js - Web framework
  - Mongoose - MongoDB ODM
  - JWT - Authentication
  - bcryptjs - Password hashing
  - Helmet - Security headers
  - CORS - Cross-origin requests
  - And more security middleware

## Development

```bash
# Backend development
npm run dev
```

The backend runs on `http://localhost:5000`.

```
```