import mongoose from 'mongoose';

export interface AdminUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpiry: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
adminUserSchema.index({ email: 1 });
adminUserSchema.index({ isActive: 1 });

export default mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);