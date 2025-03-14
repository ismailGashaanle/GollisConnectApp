const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendVerificationCode, verifyCode } = require('../utils/twilioService');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Send verification code
router.post(
  '/send-code',
  [
    body('phoneNumber').notEmpty().withMessage('Phone number is required')
  ],
  verifyToken,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phoneNumber } = req.body;

      // Send verification code
      const verificationSid = await sendVerificationCode(phoneNumber);

      // Update user's phone number if not already set
      if (!req.user.phoneNumber) {
        req.user.phoneNumber = phoneNumber;
        await req.user.save();
      }

      res.json({
        message: 'Verification code sent successfully',
        verificationSid
      });
    } catch (error) {
      console.error('Send verification code error:', error);
      res.status(500).json({ message: 'Error sending verification code' });
    }
  }
);

// Verify code
router.post(
  '/verify-code',
  [
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('code').notEmpty().withMessage('Verification code is required')
  ],
  verifyToken,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phoneNumber, code } = req.body;

      // Verify code
      const status = await verifyCode(phoneNumber, code);

      if (status === 'approved') {
        // Mark phone as verified in user profile
        req.user.isPhoneVerified = true;
        await req.user.save();

        res.json({
          message: 'Phone number verified successfully',
          status
        });
      } else {
        res.status(400).json({
          message: 'Invalid verification code',
          status
        });
      }
    } catch (error) {
      console.error('Verify code error:', error);
      res.status(500).json({ message: 'Error verifying code' });
    }
  }
);

// Get verification status
router.get('/status', verifyToken, async (req, res) => {
  try {
    res.json({
      phoneNumber: req.user.phoneNumber || null,
      isVerified: req.user.isPhoneVerified || false
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({ message: 'Error getting verification status' });
  }
});

module.exports = router; 