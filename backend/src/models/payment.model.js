const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['telesom_zaad', 'dahabshiil'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  receiptUrl: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ student: 1, semester: 1, academicYear: 1 });
paymentSchema.index({ transactionId: 1 }, { unique: true });

// Method to check if payment is valid
paymentSchema.methods.isValid = function() {
  return this.status === 'completed' && this.amount > 0;
};

// Static method to get student's payment history
paymentSchema.statics.getStudentPayments = async function(studentId) {
  return this.find({ student: studentId })
    .sort({ paymentDate: -1 })
    .populate('student', 'firstName lastName studentId');
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 