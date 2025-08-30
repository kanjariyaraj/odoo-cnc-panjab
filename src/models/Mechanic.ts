import mongoose from 'mongoose';

export interface IMechanic extends mongoose.Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  licenseNumber: string;
  specialties: string[];
  serviceRadius: number; // in kilometers
  hourlyRate: number;
  rating: number;
  totalJobs: number;
  isAvailable: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  };
  vehicle: {
    type: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  documents: {
    license: string;
    insurance: string;
    certification: string[];
  };
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  earnings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const mechanicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
  },
  specialties: [{
    type: String,
    enum: ['battery', 'tires', 'towing', 'lockout', 'engine', 'brakes', 'electrical'],
  }],
  serviceRadius: {
    type: Number,
    default: 50, // 50km radius
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: 0,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  totalJobs: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  vehicle: {
    type: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true },
  },
  documents: {
    license: String,
    insurance: String,
    certification: [String],
  },
  availability: {
    monday: { start: String, end: String, available: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
    thursday: { start: String, end: String, available: { type: Boolean, default: true } },
    friday: { start: String, end: String, available: { type: Boolean, default: true } },
    saturday: { start: String, end: String, available: { type: Boolean, default: true } },
    sunday: { start: String, end: String, available: { type: Boolean, default: false } },
  },
  earnings: {
    total: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    lastMonth: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Index for location-based queries
mechanicSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
mechanicSchema.index({ isAvailable: 1 });
mechanicSchema.index({ specialties: 1 });

export const Mechanic = mongoose.models.Mechanic || mongoose.model<IMechanic>('Mechanic', mechanicSchema);