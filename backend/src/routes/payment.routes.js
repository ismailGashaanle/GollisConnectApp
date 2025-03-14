const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const { sendPaymentReceipt } = require('../utils/emailService');
const { sendWhatsAppMessage } = require('../utils/twilioService');

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

// Validation middleware
const validatePayment = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod').isIn(['telesom_zaad', 'dahabshiil']).withMessage('Invalid payment method'),
  body('semester').notEmpty().withMessage('Semester is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required')
];

// Initiate payment
router.post('/initiate', verifyToken, validatePayment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, paymentMethod, semester, academicYear } = req.body;

    // Generate unique transaction ID
    const transactionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const payment = new Payment({
      student: req.user._id,
      amount,
      paymentMethod,
      transactionId,
      semester,
      academicYear
    });

    await payment.save();

    // Generate payment URL based on payment method
    let paymentUrl;
    if (paymentMethod === 'telesom_zaad') {
      paymentUrl = `https://telesom-zaad.com/pay/${transactionId}`;
    } else {
      paymentUrl = `https://dahabshiil.com/pay/${transactionId}`;
    }

    res.status(201).json({
      message: 'Payment initiated successfully',
      paymentId: payment._id,
      transactionId,
      paymentUrl
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ message: 'Server error during payment initiation' });
  }
});

// Verify payment
router.post('/verify/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify payment with payment provider
    let isVerified = false;
    if (payment.paymentMethod === 'telesom_zaad') {
      // Implement Telesom Zaad verification
      isVerified = true; // Placeholder
    } else {
      // Implement Dahabshiil verification
      isVerified = true; // Placeholder
    }

    if (isVerified) {
      payment.status = 'completed';
      payment.paymentDate = new Date();
      await payment.save();

      // Send email receipt
      const student = await User.findById(payment.student);
      
      try {
        await sendPaymentReceipt({
          to: student.email,
          name: `${student.firstName} ${student.lastName}`,
          amount: payment.amount,
          transactionId: payment.transactionId,
          date: payment.paymentDate,
          semester: payment.semester,
          academicYear: payment.academicYear
        });
      } catch (emailError) {
        console.error('Error sending payment receipt email:', emailError);
        // Continue with the process even if email fails
      }

      // Send WhatsApp notification
      if (student.phoneNumber && student.isPhoneVerified) {
        try {
          await sendWhatsAppMessage(
            student.phoneNumber,
            `Your payment of $${payment.amount} has been received successfully. Transaction ID: ${payment.transactionId}`
          );
        } catch (whatsappError) {
          console.error('Error sending WhatsApp notification:', whatsappError);
          // Continue with the process even if WhatsApp notification fails
        }
      }

      res.json({
        message: 'Payment verified successfully',
        payment
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
});

// Get payment history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.getStudentPayments(req.user._id);
    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error while fetching payment history' });
  }
});

module.exports = router; 