const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  category: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerPerson: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length <= 6;
      },
      message: "You can only add up to 6 images."
    }
  },
  videos: { type: [String], default: [] },
  status: {
    type: String,
    enum: ['upcoming', 'open', 'full', 'completed', 'cancelled'],
    default: 'open'
  },
  itinerary: [{
    day: { type: Number, required: true },
    activities: { type: String, required: true },
    place: { type: String, required: true }
  }],
  placeSuggestions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    place: String,
    note: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
  weatherCache: {
    available: Boolean,
    message: String,
    temperature: Number,
    condition: String,
    lastFetched: Date
  },
  recommendationCache: {
    available: Boolean,
    message: String,
    text: String,
    lastGenerated: Date
  }
});

module.exports = mongoose.model('Trip', TripSchema);