# GollisConnect Backend

Backend server for the GollisConnect Educational Management System.

## Features

- User authentication and authorization
- Student and faculty management
- Course management
- Grade management with email notifications
- Payment processing with email receipts
- Email notifications for various events
- Phone verification and WhatsApp notifications

## Email Functionality

GollisConnect uses Mailgun SMTP for sending emails. The following email types are supported:

1. **Welcome Emails**: Sent when a new user registers
2. **Payment Receipts**: Sent when a payment is processed
3. **Grade Notifications**: Sent when a grade is posted or updated
4. **Password Reset Emails**: Sent when a user requests a password reset

## Phone Verification

GollisConnect uses Twilio Verify for phone verification. This allows:

1. **Phone Verification**: Verify user phone numbers via SMS
2. **WhatsApp Notifications**: Send payment and grade notifications via WhatsApp

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Mailgun account
- Twilio account with Verify service

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gollisconnect
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   # Email Configuration (Mailgun)
   MAILGUN_USERNAME=your_mailgun_username
   MAILGUN_PASSWORD=your_mailgun_password
   EMAIL_FROM=GollisConnect <your_sender_email>
   
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   TWILIO_VERIFY_SERVICE_ID=your_twilio_verify_service_id
   
   # Payment Gateway Configuration
   TELESOM_ZAAD_API_KEY=your_telesom_zaad_api_key
   DAHABSHIIL_API_KEY=your_dahabshiil_api_key
   ```

### Setting Up Twilio Verify

1. Create a Twilio account at [twilio.com](https://www.twilio.com)
2. Navigate to the Verify section in the Twilio Console
3. Create a new Verify Service with a friendly name (e.g., "GollisConnect Verification")
4. Copy the Verify Service SID (starts with "VA") to your `.env` file
5. Get your Account SID and Auth Token from the Twilio Console dashboard
6. Add these values to your `.env` file:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_VERIFY_SERVICE_ID=your_verify_service_sid
   ```
7. Test your Twilio configuration:
   ```
   node src/scripts/testTwilioAuth.js
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## Testing Email Functionality

You can test the email functionality using the provided test script:

```
node src/scripts/testEmail.js
```

This will test all email types. To test a specific email type, use:

```
node src/scripts/testEmail.js welcome    # Test welcome email
node src/scripts/testEmail.js payment    # Test payment receipt
node src/scripts/testEmail.js grade      # Test grade notification
node src/scripts/testEmail.js reset      # Test password reset
```

## Testing Twilio Functionality

You can test the Twilio functionality using the provided test scripts:

```
# Test Twilio authentication and Verify service
node src/scripts/testTwilioAuth.js

# Test sending verification code
node src/scripts/testTwilio.js send

# Test verifying code (replace <code> with the code you received)
node src/scripts/testTwilio.js verify <code>

# Test sending WhatsApp message
node src/scripts/testTwilio.js whatsapp
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

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

## License

MIT 