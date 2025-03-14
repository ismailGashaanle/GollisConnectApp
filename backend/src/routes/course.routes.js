const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Course = require('../models/course.model');
const User = require('../models/user.model');

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

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Middleware to check if user is faculty or admin
const isFacultyOrAdmin = (req, res, next) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Faculty or admin only.' });
  }
  next();
};

// Validation middleware for course
const validateCourse = [
  body('name').notEmpty().withMessage('Course name is required'),
  body('code').notEmpty().withMessage('Course code is required'),
  body('creditHours').isInt({ min: 1, max: 6 }).withMessage('Credit hours must be between 1 and 6'),
  body('department').notEmpty().withMessage('Department is required')
];

// Create a new course (admin only)
router.post('/', verifyToken, isAdmin, validateCourse, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, description, creditHours, department, instructor, prerequisites } = req.body;

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this code already exists' });
    }

    // Create new course
    const course = new Course({
      name,
      code,
      description,
      creditHours,
      department,
      instructor,
      prerequisites
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a course (admin only)
router.put('/:id', verifyToken, isAdmin, validateCourse, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, code, description, creditHours, department, instructor, prerequisites, isActive } = req.body;

    // Check if course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if updated code already exists (if code is being changed)
    if (code !== course.code) {
      const existingCourse = await Course.findOne({ code });
      if (existingCourse) {
        return res.status(400).json({ message: 'Course with this code already exists' });
      }
    }

    // Update course
    course.name = name;
    course.code = code;
    course.description = description;
    course.creditHours = creditHours;
    course.department = department;
    course.instructor = instructor;
    course.prerequisites = prerequisites;
    if (isActive !== undefined) {
      course.isActive = isActive;
    }

    await course.save();

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all courses
router.get('/', verifyToken, async (req, res) => {
  try {
    const { department, active } = req.query;
    
    let query = {};
    
    if (department) {
      query.department = department;
    }
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName')
      .sort({ code: 1 });
    
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single course by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id)
      .populate('instructor', 'firstName lastName');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses by instructor
router.get('/instructor/:instructorId', verifyToken, async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    // Check if instructor exists
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'faculty') {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    const courses = await Course.find({ instructor: instructorId, isActive: true })
      .sort({ code: 1 });
    
    res.json(courses);
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a course (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Instead of deleting, mark as inactive
    course.isActive = false;
    await course.save();
    
    res.json({ message: 'Course deactivated successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 