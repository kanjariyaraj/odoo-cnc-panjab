import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'user' | 'mechanic' | 'admin';
  isActive: boolean;
  shopId?: mongoose.Types.ObjectId; // For mechanics - which shop they belong to
  shopName?: string; // For admins - their shop name
  profile: {
    avatar?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    specialties?: string[]; // For mechanics
    rating?: number; // For mechanics
    completedJobs?: number; // For mechanics
    yearsExperience?: number; // For mechanics
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'mechanic', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the admin user who owns the shop
    required: function(this: IUser) { return this.role === 'mechanic'; }
  },
  shopName: {
    type: String,
    required: function(this: IUser) { return this.role === 'admin'; }
  },
  profile: {
    avatar: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    specialties: [String], // For mechanics
    rating: { type: Number, default: 0 }, // For mechanics
    completedJobs: { type: Number, default: 0 }, // For mechanics
    yearsExperience: { type: Number, default: 0 }, // For mechanics
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);