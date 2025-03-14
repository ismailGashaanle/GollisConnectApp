# GollisConnect App

A comprehensive educational management system for Gollis University.

![Gollis University Logo](https://media.licdn.com/dms/image/v2/C4E0BAQHqhuqoxHldhw/company-logo_200_200/company-logo_200_200/0/1643699691224/gollis_edu_logo?e=2147483647&v=beta&t=oe3dAluSO_i5hRnHEqkHnFhL3agqfRbs0kpGq5aX5Cg)

## Overview

GollisConnect is a modern educational management system designed specifically for Gollis University. Our platform streamlines administrative processes, improves operational efficiency, and enhances the student and faculty experience.

## Features

- **User Authentication**: Secure login and registration for students, faculty, and administrators
- **Student Dashboard**: Access to grades, courses, and payment information
- **Fee Payment**: Online payment processing with local payment methods
- **Grade Management**: Real-time access to grades and GPA calculation
- **Course Management**: Course registration and management
- **Digital Student ID**: Online student ID verification
- **Communication**: Messaging system between students and faculty
- **Email Notifications**: Automated emails for important events
- **Phone Verification**: Secure phone verification via SMS
- **WhatsApp Notifications**: Payment and grade notifications via WhatsApp

## Tech Stack

### Frontend
- React.js
- React Router
- Context API for state management
- Bootstrap for styling
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Nodemailer for email notifications
- Twilio for SMS and WhatsApp notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/ismailGashaanle/GollisConnectApp.git
   cd GollisConnectApp
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the values in the `.env` file with your actual credentials

5. Start the backend server:
   ```
   cd ../backend
   npm run dev
   ```

6. Start the frontend development server:
   ```
   cd ../frontend
   npm run dev
   ```

7. Access the application at `http://localhost:3000`

## API Documentation

The backend provides the following API endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Courses
- `POST /api/courses` - Create a new course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Grades
- `POST /api/grades` - Add a new grade
- `GET /api/grades/student` - Get grades for a student
- `GET /api/grades/course/:courseId` - Get grades for a course
- `PUT /api/grades/:id` - Update a grade
- `DELETE /api/grades/:id` - Delete a grade

### Payments
- `POST /api/payments/initiate` - Initiate a payment
- `POST /api/payments/verify/:transactionId` - Verify a payment
- `GET /api/payments/history` - Get payment history

### Verification
- `POST /api/verification/send-code` - Send verification code
- `POST /api/verification/verify-code` - Verify code
- `GET /api/verification/status` - Get verification status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Ismail Gashaanle - ismailGashaanle@gmail.com

Project Link: [https://github.com/ismailGashaanle/GollisConnectApp](https://github.com/ismailGashaanle/GollisConnectApp)
