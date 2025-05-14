import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 6
  },
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Document will be automatically deleted after 10 minutes
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
});

// Pre-save hook to ensure OTP is exactly 6 digits
OTPSchema.pre('save', function(next) {
  // Set expiresAt if not set
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }
  
  // Ensure OTP is exactly 6 digits
  if (!/^\d{6}$/.test(this.otp)) {
    next(new Error('OTP must be exactly 6 digits'));
    return;
  }

  next();
});

// Add compound index for faster lookups
OTPSchema.index({ email: 1, otp: 1 });

const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);

export default OTP; 