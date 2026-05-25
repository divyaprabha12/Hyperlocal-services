import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['electrician', 'plumber', 'cleaner', 'carpenter', 'painter', 'ac_technician', 'home_repair'],
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    default: 100
  },
  description: {
    type: String,
    required: true
  },
  durationEstimate: {
    type: String,
    default: '1-2 hours'
  },
  popularityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
