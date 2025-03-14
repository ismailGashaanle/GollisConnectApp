/**
 * Test script for Twilio verification
 * 
 * Run with: node src/scripts/testTwilio.js
 */

const dotenv = require('dotenv');
const path = require('path');
const { sendVerificationCode, verifyCode, sendWhatsAppMessage } = require('../utils/twilioService');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Test phone number (replace with your actual phone number for testing)
const TEST_PHONE_NUMBER = '+252637856383';

// Function to test sending verification code
async function testSendVerificationCode() {
  try {
    console.log(`Sending verification code to ${TEST_PHONE_NUMBER}...`);
    const verificationSid = await sendVerificationCode(TEST_PHONE_NUMBER);
    console.log('Verification code sent successfully!');
    console.log('Verification SID:', verificationSid);
    return verificationSid;
  } catch (error) {
    console.error('Error sending verification code:', error);
  }
}

// Function to test verifying code
async function testVerifyCode(code) {
  try {
    console.log(`Verifying code for ${TEST_PHONE_NUMBER}...`);
    const status = await verifyCode(TEST_PHONE_NUMBER, code);
    console.log('Verification status:', status);
    return status;
  } catch (error) {
    console.error('Error verifying code:', error);
  }
}

// Function to test sending WhatsApp message
async function testSendWhatsAppMessage() {
  try {
    console.log(`Sending WhatsApp message to ${TEST_PHONE_NUMBER}...`);
    const messageSid = await sendWhatsAppMessage(
      TEST_PHONE_NUMBER,
      'This is a test message from GollisConnect!'
    );
    console.log('WhatsApp message sent successfully!');
    console.log('Message SID:', messageSid);
    return messageSid;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'send':
      await testSendVerificationCode();
      break;
      
    case 'verify':
      if (!args[1]) {
        console.error('Please provide a verification code');
        process.exit(1);
      }
      await testVerifyCode(args[1]);
      break;
      
    case 'whatsapp':
      await testSendWhatsAppMessage();
      break;
      
    default:
      console.log('Available commands:');
      console.log('  send - Send verification code');
      console.log('  verify <code> - Verify code');
      console.log('  whatsapp - Send WhatsApp message');
      break;
  }
  
  process.exit(0);
}

// Run the main function
main(); 