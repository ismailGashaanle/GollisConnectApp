/**
 * Test script to verify Twilio Auth Token
 * 
 * Run with: node src/scripts/testTwilioAuth.js
 */

const dotenv = require('dotenv');
const path = require('path');
const twilio = require('twilio');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Main function
async function main() {
  console.log('Testing Twilio authentication...');
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceId = process.env.TWILIO_VERIFY_SERVICE_ID;
  
  console.log('Account SID:', accountSid);
  console.log('Auth Token:', authToken ? '********' + authToken.slice(-4) : 'Not set');
  console.log('Verify Service ID:', verifyServiceId);
  
  try {
    // Initialize Twilio client
    const client = twilio(accountSid, authToken);
    
    // Test authentication by fetching account details
    const account = await client.api.accounts(accountSid).fetch();
    console.log('\nAuthentication successful!');
    console.log('Account Status:', account.status);
    console.log('Account Name:', account.friendlyName);
    
    // Test Verify service
    console.log('\nTesting Verify service...');
    const verifyService = await client.verify.v2.services(verifyServiceId).fetch();
    console.log('Verify Service Name:', verifyService.friendlyName);
    console.log('Verify Service Status:', verifyService.status);
    
    console.log('\nAll tests passed! Your Twilio configuration is working correctly.');
  } catch (error) {
    console.error('\nError testing Twilio authentication:');
    
    if (error.code === 20003) {
      console.error('Authentication Failed: Your Auth Token is invalid or not set correctly.');
      console.error('Please check your TWILIO_AUTH_TOKEN in the .env file.');
    } else if (error.code === 20404) {
      console.error('Service Not Found: The Verify Service ID is invalid or not set correctly.');
      console.error('Please check your TWILIO_VERIFY_SERVICE_ID in the .env file.');
    } else {
      console.error('Error details:', error.message);
      console.error('Error code:', error.code);
    }
    
    console.error('\nPlease update your .env file with the correct credentials and try again.');
  }
}

// Run the main function
main(); 