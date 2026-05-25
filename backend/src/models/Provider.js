import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['electrician', 'plumber', 'cleaner', 'carpenter', 'painter', 'ac_technician', 'home_repair'],
    required: true
  },
  skills: [String],
  experienceYears: {
    type: Number,
    required: true,
    default: 1
  },
  bio: {
    type: String,
    default: ''
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  kycDocument: {
    docType: { type: String, default: 'ID_CARD' },
    docUrl: { type: String, default: '' }
  },
  hourlyRate: {
    type: Number,
    required: true,
    default: 150
  },
  rating: {
    type: Number,
    default: 5.0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  availability: {
    days: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    slots: {
      type: [String],
      default: ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']
    }
  },
  isAvailableNow: {
    type: Boolean,
    default: true
  },
  portfolio: [{
    title: String,
    imageUrl: String,
    description: String
  }],
  completedJobs: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Provider = mongoose.model('Provider', providerSchema);
export default Provider;
