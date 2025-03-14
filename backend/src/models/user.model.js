const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profileImage: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to get user's full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Static method to get user by ID with selected fields
userSchema.statics.findByIdWithSelect = async function(id, fields) {
  return this.findById(id).select(fields);
};

// Static method to get all faculty members
userSchema.statics.getAllFaculty = async function() {
  return this.find({ role: 'faculty' }).select('-password');
};

// Static method to get all students in a department
userSchema.statics.getStudentsByDepartment = async function(department) {
  return this.find({ role: 'student', department }).select('-password');
};

const User = mongoose.model('User', userSchema);

module.exports = User; 