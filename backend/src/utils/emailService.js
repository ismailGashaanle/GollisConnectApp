const nodemailer = require('nodemailer');

// Create reusable transporter object using Mailgun SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

/**
 * Send a welcome email to a new user
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.role - User role (student/faculty)
 */
const sendWelcomeEmail = async ({ to, name, role }) => {
  const subject = 'Welcome to GollisConnect!';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4a6cf7;">Welcome to GollisConnect!</h1>
      </div>
      
      <p>Dear ${name},</p>
      
      <p>Welcome to GollisConnect, the official platform for Gollis University! We're excited to have you join our community.</p>
      
      <p>As a ${role}, you now have access to:</p>
      
      <ul>
        ${role === 'student' ? `
          <li>View and pay your tuition fees</li>
          <li>Access your grades and GPA</li>
          <li>Download your digital student ID</li>
          <li>Communicate with faculty members</li>
        ` : `
          <li>Manage student grades</li>
          <li>Communicate with students</li>
          <li>Access faculty resources</li>
          <li>View department information</li>
        `}
      </ul>
      
      <p>To get started, simply log in to your account and explore the platform.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/login" style="background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In Now</a>
      </div>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      
      <p>Best regards,<br>The GollisConnect Team</p>
    </div>
  `;
  
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
};

/**
 * Send a payment receipt email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {number} options.amount - Payment amount
 * @param {string} options.transactionId - Transaction ID
 * @param {Date} options.date - Payment date
 * @param {string} options.semester - Semester
 * @param {string} options.academicYear - Academic year
 */
const sendPaymentReceipt = async ({ to, name, amount, transactionId, date, semester, academicYear }) => {
  const subject = 'Payment Receipt - Gollis University';
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4a6cf7;">Payment Receipt</h1>
      </div>
      
      <p>Dear ${name},</p>
      
      <p>Your payment has been received successfully. Here are the details:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Semester:</strong> ${semester}</p>
        <p><strong>Academic Year:</strong> ${academicYear}</p>
      </div>
      
      <p>You can view your payment history and download this receipt from your GollisConnect dashboard.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/dashboard/payments" style="background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Payment History</a>
      </div>
      
      <p>Thank you for your payment!</p>
      
      <p>Best regards,<br>The GollisConnect Team</p>
    </div>
  `;
  
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
};

/**
 * Send a grade notification email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.courseName - Course name
 * @param {string} options.grade - Grade
 * @param {string} options.semester - Semester
 * @param {string} options.academicYear - Academic year
 */
const sendGradeNotification = async ({ to, name, courseName, grade, semester, academicYear }) => {
  const subject = `New Grade Posted: ${courseName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4a6cf7;">Grade Notification</h1>
      </div>
      
      <p>Dear ${name},</p>
      
      <p>A new grade has been posted for one of your courses:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Course:</strong> ${courseName}</p>
        <p><strong>Grade:</strong> ${grade}</p>
        <p><strong>Semester:</strong> ${semester}</p>
        <p><strong>Academic Year:</strong> ${academicYear}</p>
      </div>
      
      <p>You can view all your grades and GPA on your GollisConnect dashboard.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/dashboard/grades" style="background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View All Grades</a>
      </div>
      
      <p>If you have any questions about this grade, please contact your instructor or the academic office.</p>
      
      <p>Best regards,<br>The GollisConnect Team</p>
    </div>
  `;
  
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
};

/**
 * Send a password reset email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.resetToken - Password reset token
 */
const sendPasswordResetEmail = async ({ to, name, resetToken }) => {
  const subject = 'Password Reset - GollisConnect';
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4a6cf7;">Password Reset</h1>
      </div>
      
      <p>Dear ${name},</p>
      
      <p>We received a request to reset your password for your GollisConnect account. If you didn't make this request, you can safely ignore this email.</p>
      
      <p>To reset your password, click the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      
      <p>This link will expire in 1 hour for security reasons.</p>
      
      <p>If the button above doesn't work, you can copy and paste the following URL into your browser:</p>
      
      <p style="word-break: break-all; background-color: #f9f9f9; padding: 10px; border-radius: 5px;">${resetUrl}</p>
      
      <p>Best regards,<br>The GollisConnect Team</p>
    </div>
  `;
  
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
};

module.exports = {
  sendWelcomeEmail,
  sendPaymentReceipt,
  sendGradeNotification,
  sendPasswordResetEmail
}; 