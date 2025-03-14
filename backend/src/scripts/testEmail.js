/**
 * Test script for email functionality
 * 
 * Run with: node src/scripts/testEmail.js
 */

const dotenv = require('dotenv');
const path = require('path');
const { 
  sendWelcomeEmail, 
  sendPaymentReceipt, 
  sendGradeNotification, 
  sendPasswordResetEmail 
} = require('../utils/emailService');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Test email address
const TEST_EMAIL = 'test@example.com';

// Function to test all email types
async function testAllEmails() {
  try {
    console.log('Testing email functionality...');
    
    // Test welcome email
    console.log('\n1. Testing welcome email...');
    await sendWelcomeEmail({
      to: TEST_EMAIL,
      name: 'John Doe',
      role: 'student'
    });
    console.log('Welcome email sent successfully!');
    
    // Test payment receipt
    console.log('\n2. Testing payment receipt email...');
    await sendPaymentReceipt({
      to: TEST_EMAIL,
      name: 'John Doe',
      amount: 500,
      transactionId: 'TRX123456789',
      date: new Date(),
      semester: 'Fall 2023',
      academicYear: '2023-2024'
    });
    console.log('Payment receipt email sent successfully!');
    
    // Test grade notification
    console.log('\n3. Testing grade notification email...');
    await sendGradeNotification({
      to: TEST_EMAIL,
      name: 'John Doe',
      courseName: 'Introduction to Computer Science',
      grade: 'A',
      semester: 'Fall 2023',
      academicYear: '2023-2024'
    });
    console.log('Grade notification email sent successfully!');
    
    // Test password reset
    console.log('\n4. Testing password reset email...');
    await sendPasswordResetEmail({
      to: TEST_EMAIL,
      name: 'John Doe',
      resetToken: 'abc123def456ghi789'
    });
    console.log('Password reset email sent successfully!');
    
    console.log('\nAll email tests completed successfully!');
  } catch (error) {
    console.error('Error testing emails:', error);
  }
}

// Test a specific email type
async function testSpecificEmail(emailType) {
  try {
    switch (emailType) {
      case 'welcome':
        console.log('Testing welcome email...');
        await sendWelcomeEmail({
          to: TEST_EMAIL,
          name: 'John Doe',
          role: 'student'
        });
        console.log('Welcome email sent successfully!');
        break;
        
      case 'payment':
        console.log('Testing payment receipt email...');
        await sendPaymentReceipt({
          to: TEST_EMAIL,
          name: 'John Doe',
          amount: 500,
          transactionId: 'TRX123456789',
          date: new Date(),
          semester: 'Fall 2023',
          academicYear: '2023-2024'
        });
        console.log('Payment receipt email sent successfully!');
        break;
        
      case 'grade':
        console.log('Testing grade notification email...');
        await sendGradeNotification({
          to: TEST_EMAIL,
          name: 'John Doe',
          courseName: 'Introduction to Computer Science',
          grade: 'A',
          semester: 'Fall 2023',
          academicYear: '2023-2024'
        });
        console.log('Grade notification email sent successfully!');
        break;
        
      case 'reset':
        console.log('Testing password reset email...');
        await sendPasswordResetEmail({
          to: TEST_EMAIL,
          name: 'John Doe',
          resetToken: 'abc123def456ghi789'
        });
        console.log('Password reset email sent successfully!');
        break;
        
      default:
        console.error('Invalid email type. Use: welcome, payment, grade, or reset');
    }
  } catch (error) {
    console.error(`Error testing ${emailType} email:`, error);
  }
}

// Main function
async function main() {
  // Get email type from command line arguments
  const emailType = process.argv[2];
  
  if (!emailType) {
    // Test all email types if no specific type is provided
    await testAllEmails();
  } else {
    // Test specific email type
    await testSpecificEmail(emailType);
  }
  
  process.exit(0);
}

// Run the main function
main(); 