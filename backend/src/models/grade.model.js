const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F'],
      required: true
    },
    semester: {
      type: String,
      required: true,
      trim: true
    },
    academicYear: {
      type: String,
      required: true,
      trim: true
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
gradeSchema.index({ student: 1, course: 1, semester: 1, academicYear: 1 }, { unique: true });

// Helper function to convert letter grade to grade points
const getGradePoints = (grade) => {
  const gradeMap = {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
  };
  return gradeMap[grade] || 0;
};

// Static method to calculate GPA for a student
gradeSchema.statics.calculateGPA = async function(studentId) {
  const grades = await this.find({ student: studentId }).populate('course', 'creditHours');
  
  if (grades.length === 0) {
    return 0;
  }
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  grades.forEach(grade => {
    const creditHours = grade.course.creditHours || 3; // Default to 3 if not specified
    const gradePoints = getGradePoints(grade.grade);
    
    totalPoints += gradePoints * creditHours;
    totalCredits += creditHours;
  });
  
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

// Static method to get grades by semester
gradeSchema.statics.getGradesBySemester = async function(studentId, semester, academicYear) {
  const query = { student: studentId };
  
  if (semester) {
    query.semester = semester;
  }
  
  if (academicYear) {
    query.academicYear = academicYear;
  }
  
  return this.find(query)
    .populate('course', 'name code creditHours')
    .populate('submittedBy', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Static method to get all grades for a student
gradeSchema.statics.getStudentGrades = async function(studentId) {
  return this.find({ student: studentId })
    .populate('course', 'name code creditHours')
    .populate('submittedBy', 'firstName lastName')
    .sort({ semester: -1, academicYear: -1 });
};

// Static method to get all grades for a course
gradeSchema.statics.getCourseGrades = async function(courseId, semester, academicYear) {
  const query = { course: courseId };
  
  if (semester) {
    query.semester = semester;
  }
  
  if (academicYear) {
    query.academicYear = academicYear;
  }
  
  return this.find(query)
    .populate('student', 'firstName lastName studentId')
    .populate('submittedBy', 'firstName lastName')
    .sort({ 'student.lastName': 1, 'student.firstName': 1 });
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade; 