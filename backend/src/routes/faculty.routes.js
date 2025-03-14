const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const Grade = require('../models/grade.model');

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

// Middleware to check if user is faculty
const isFaculty = (req, res, next) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Faculty only.' });
  }
  next();
};

// Get faculty profile
router.get('/profile', verifyToken, isFaculty, async (req, res) => {
  try {
    const faculty = await User.findById(req.user._id).select('-password');
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty profile error:', error);
    res.status(500).json({ message: 'Server error while fetching faculty profile' });
  }
});

// Update faculty profile
router.put('/profile', verifyToken, isFaculty, [
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

    const updatedFaculty = await User.findByIdAndUpdate(
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
      faculty: updatedFaculty
    });
  } catch (error) {
    console.error('Update faculty profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Get all students
router.get('/students', verifyToken, isFaculty, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('_id firstName lastName studentId email department');
    
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});

// Get student details
router.get('/students/:studentId', verifyToken, isFaculty, async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.studentId,
      role: 'student'
    }).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student details error:', error);
    res.status(500).json({ message: 'Server error while fetching student details' });
  }
});

// Get student grades
router.get('/students/:studentId/grades', verifyToken, isFaculty, async (req, res) => {
  try {
    const { semester, academicYear } = req.query;
    
    const student = await User.findOne({
      _id: req.params.studentId,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const gradeReport = await Grade.getGradeReport(req.params.studentId, semester, academicYear);
    res.json(gradeReport);
  } catch (error) {
    console.error('Get student grades error:', error);
    res.status(500).json({ message: 'Server error while fetching student grades' });
  }
});

// Get faculty's submitted grades
router.get('/grades', verifyToken, isFaculty, async (req, res) => {
  try {
    const { semester, academicYear } = req.query;
    
    const grades = await Grade.find({
      instructor: req.user._id,
      ...(semester && { semester }),
      ...(academicYear && { academicYear })
    }).populate('student', 'firstName lastName studentId');

    res.json(grades);
  } catch (error) {
    console.error('Get faculty grades error:', error);
    res.status(500).json({ message: 'Server error while fetching faculty grades' });
  }
});

module.exports = router; 