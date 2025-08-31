import mongoose from 'mongoose';

export interface IServiceRequest extends mongoose.Document {
  _id: string;
  requestId?: string;
  userId: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId; // Shop owner who gets the request
  mechanicId?: mongoose.Types.ObjectId; // Employee assigned by admin
  service: {
    type: 'battery' | 'tires' | 'towing' | 'lockout' | 'engine' | 'brakes' | 'electrical' | 'other';
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'emergency';
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
    landmark?: string;
  };
  status: 'pending' | 'admin-review' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  timeline: {
    requested: Date;
    assigned?: Date;
    started?: Date;
    completed?: Date;
    cancelled?: Date;
  };
  pricing: {
    baseFee: number;
    serviceFee: number;
    additionalCharges: number;
    total: number;
    currency: string;
  };
  payment: {
    method?: 'card' | 'cash' | 'digital';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
  };
  rating?: {
    score: number;
    review?: string;
    mechanicRating?: number;
    mechanicReview?: string;
  };
  notes?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Shop owner who gets the request
  },
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Employee assigned by admin
  },
  service: {
    type: {
      type: String,
      enum: ['battery', 'tires', 'towing', 'lockout', 'engine', 'brakes', 'electrical', 'other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium',
    },
  },
  vehicle: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    licensePlate: { type: String, required: true },
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    landmark: String,
  },
  status: {
    type: String,
    enum: ['pending', 'admin-review', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  timeline: {
    requested: { type: Date, default: Date.now },
    assigned: Date,
    started: Date,
    completed: Date,
    cancelled: Date,
  },
  pricing: {
    baseFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'cash', 'digital'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: String,
    mechanicRating: { type: Number, min: 1, max: 5 },
    mechanicReview: String,
  },
  notes: String,
  images: [String],
}, {
  timestamps: true,
});

// Generate unique request ID
serviceRequestSchema.pre('save', function(next) {
  if (!this.requestId) {
    // Generate a unique request ID with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();
    this.requestId = `REQ-${timestamp}-${randomString}`;
  }
  next();
});

// Indexes for efficient queries
serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
serviceRequestSchema.index({ userId: 1 });
serviceRequestSchema.index({ mechanicId: 1 });
// requestId index is handled by unique: true in schema definition

// Force delete the model if it exists to avoid caching issues
if (mongoose.models.ServiceRequest) {
  delete mongoose.models.ServiceRequest;
}

export const ServiceRequest = mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);