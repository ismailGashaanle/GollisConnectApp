const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send verification code via SMS
 * @param {string} phoneNumber - Phone number to send verification code to
 * @returns {Promise} - Promise that resolves with the verification SID
 */
const sendVerificationCode = async (phoneNumber) => {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    
    return verification.sid;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

/**
 * Verify code sent to phone number
 * @param {string} phoneNumber - Phone number to verify
 * @param {string} code - Verification code
 * @returns {Promise} - Promise that resolves with verification status
 */
const verifyCode = async (phoneNumber, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID)
      .verificationChecks
      .create({ to: phoneNumber, code });
    
    return verificationCheck.status;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

/**
 * Send WhatsApp message
 * @param {string} to - Recipient phone number
 * @param {string} body - Message body
 * @returns {Promise} - Promise that resolves with the message SID
 */
const sendWhatsAppMessage = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    return message.sid;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationCode,
  verifyCode,
  sendWhatsAppMessage
}; 