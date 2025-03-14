const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    creditHours: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    prerequisites: [{
      type: String,
      trim: true
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
courseSchema.index({ code: 1 }, { unique: true });
courseSchema.index({ department: 1 });

// Static method to get all active courses
courseSchema.statics.getActiveCourses = function() {
  return this.find({ isActive: true }).sort({ code: 1 });
};

// Static method to get courses by department
courseSchema.statics.getCoursesByDepartment = function(department) {
  return this.find({ department, isActive: true }).sort({ code: 1 });
};

// Static method to get course by code
courseSchema.statics.getCourseByCode = function(code) {
  return this.findOne({ code });
};

// Static method to get courses taught by an instructor
courseSchema.statics.getCoursesByInstructor = function(instructorId) {
  return this.find({ instructor: instructorId, isActive: true }).sort({ code: 1 });
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 