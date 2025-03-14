const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const Grade = require('../models/grade.model');
const Payment = require('../models/payment.model');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'));
  }
});

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

// Middleware to check if user is a student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Students only.' });
  }
  next();
};

// Get student profile
router.get('/profile', verifyToken, isStudent, async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password');
    res.json(student);
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ message: 'Server error while fetching student profile' });
  }
});

// Update student profile
router.put('/profile', verifyToken, isStudent, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phoneNumber').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, phoneNumber, email } = req.body;
    
    // Check if email is already in use
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    const updatedStudent = await User.findByIdAndUpdate(
      req.user._id,
      { 
        firstName: firstName || req.user.firstName,
        lastName: lastName || req.user.lastName,
        phoneNumber: phoneNumber || req.user.phoneNumber,
        email: email || req.user.email
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Get student's grades
router.get('/grades', verifyToken, isStudent, async (req, res) => {
  try {
    const { semester, academicYear } = req.query;
    
    const gradeReport = await Grade.getGradeReport(req.user._id, semester, academicYear);
    res.json(gradeReport);
  } catch (error) {
    console.error('Get student grades error:', error);
    res.status(500).json({ message: 'Server error while fetching grades' });
  }
});

// Get student's payment history
router.get('/payments', verifyToken, isStudent, async (req, res) => {
  try {
    const payments = await Payment.getStudentPayments(req.user._id);
    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error while fetching payment history' });
  }
});

// Upload student ID photo
router.post('/upload-id-photo', verifyToken, isStudent, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    
    // Update user with photo URL
    await User.findByIdAndUpdate(req.user._id, { idPhotoUrl: photoUrl });

    res.json({
      message: 'ID photo uploaded successfully',
      photoUrl
    });
  } catch (error) {
    console.error('Upload ID photo error:', error);
    res.status(500).json({ message: 'Server error during photo upload' });
  }
});

// Generate student ID card
router.get('/generate-id-card', verifyToken, isStudent, async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    
    // Check if student has a photo
    if (!student.idPhotoUrl) {
      return res.status(400).json({ message: 'Please upload an ID photo first' });
    }

    // Check if student has made payments for the current semester
    const currentSemester = req.query.semester;
    const currentAcademicYear = req.query.academicYear;
    
    const payment = await Payment.findOne({
      student: req.user._id,
      semester: currentSemester,
      academicYear: currentAcademicYear,
      status: 'completed'
    });

    if (!payment) {
      return res.status(400).json({ message: 'Please complete your fee payment for the current semester' });
    }

    // Generate ID card (in a real system, this would create a PDF or image)
    const idCard = {
      studentId: student.studentId,
      name: `${student.firstName} ${student.lastName}`,
      department: student.department,
      photoUrl: student.idPhotoUrl,
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      issuedDate: new Date()
    };

    res.json({
      message: 'ID card generated successfully',
      idCard
    });
  } catch (error) {
    console.error('Generate ID card error:', error);
    res.status(500).json({ message: 'Server error during ID card generation' });
  }
});

module.exports = router; 