const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Grade = require('../models/grade.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const { sendGradeNotification } = require('../utils/emailService');

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

// Validation middleware for adding/updating grades
const validateGrade = [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('courseId').notEmpty().withMessage('Course ID is required'),
  body('grade').isIn(['A', 'B', 'C', 'D', 'F']).withMessage('Grade must be A, B, C, D, or F'),
  body('semester').notEmpty().withMessage('Semester is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required')
];

// Add a new grade
router.post('/', verifyToken, isFaculty, validateGrade, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, courseId, grade, semester, academicYear } = req.body;

    // Check if student exists
    const student = await User.findOne({ studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if grade already exists for this student and course
    const existingGrade = await Grade.findOne({
      student: student._id,
      course: courseId,
      semester,
      academicYear
    });

    if (existingGrade) {
      return res.status(400).json({ message: 'Grade already exists for this student and course' });
    }

    // Create new grade
    const newGrade = new Grade({
      student: student._id,
      course: courseId,
      grade,
      semester,
      academicYear,
      submittedBy: req.user._id
    });

    await newGrade.save();

    // Send email notification to student
    try {
      await sendGradeNotification({
        to: student.email,
        name: `${student.firstName} ${student.lastName}`,
        courseName: course.name,
        grade,
        semester,
        academicYear
      });
    } catch (emailError) {
      console.error('Error sending grade notification email:', emailError);
      // Continue with the process even if email fails
    }

    res.status(201).json({
      message: 'Grade added successfully',
      grade: newGrade
    });
  } catch (error) {
    console.error('Add grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a grade
router.put('/:id', verifyToken, isFaculty, validateGrade, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, courseId, grade, semester, academicYear } = req.body;
    const { id } = req.params;

    // Check if grade exists
    const existingGrade = await Grade.findById(id);
    if (!existingGrade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Check if student exists
    const student = await User.findOne({ studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update grade
    existingGrade.student = student._id;
    existingGrade.course = courseId;
    existingGrade.grade = grade;
    existingGrade.semester = semester;
    existingGrade.academicYear = academicYear;
    existingGrade.updatedBy = req.user._id;

    await existingGrade.save();

    // Send email notification to student if grade changed
    if (existingGrade.grade !== grade) {
      try {
        await sendGradeNotification({
          to: student.email,
          name: `${student.firstName} ${student.lastName}`,
          courseName: course.name,
          grade,
          semester,
          academicYear
        });
      } catch (emailError) {
        console.error('Error sending grade update notification email:', emailError);
        // Continue with the process even if email fails
      }
    }

    res.json({
      message: 'Grade updated successfully',
      grade: existingGrade
    });
  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all grades for a student
router.get('/student', verifyToken, async (req, res) => {
  try {
    let studentId;
    
    if (req.user.role === 'student') {
      // If the user is a student, get their own grades
      studentId = req.user._id;
    } else if (req.user.role === 'faculty' || req.user.role === 'admin') {
      // If the user is faculty or admin, they can get grades for any student
      if (!req.query.studentId) {
        return res.status(400).json({ message: 'Student ID is required' });
      }
      const student = await User.findOne({ studentId: req.query.studentId, role: 'student' });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      studentId = student._id;
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get grades with course details
    const grades = await Grade.find({ student: studentId })
      .populate('course', 'name code creditHours')
      .populate('submittedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Calculate GPA
    const gpa = await Grade.calculateGPA(studentId);

    res.json({
      grades,
      gpa
    });
  } catch (error) {
    console.error('Get student grades error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all grades for a course
router.get('/course/:courseId', verifyToken, isFaculty, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { semester, academicYear } = req.query;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Build query
    const query = { course: courseId };
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    // Get grades with student details
    const grades = await Grade.find(query)
      .populate('student', 'firstName lastName studentId')
      .sort({ 'student.lastName': 1, 'student.firstName': 1 });

    res.json(grades);
  } catch (error) {
    console.error('Get course grades error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a grade
router.delete('/:id', verifyToken, isFaculty, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if grade exists
    const grade = await Grade.findById(id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    await grade.remove();

    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 