
const mongoose = require('mongoose');

const TripRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destinationRequest: { type: String, required: true },
    preferredDate: { type:String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    adminResponse: { type: String },
    // The admin who claimed this request. Once set, only they can respond.
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    handledAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TripRequest', TripRequestSchema);
