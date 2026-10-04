const mongoose = require('mongoose');

const TripMembershipSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted'],
      default: 'confirmed'
    },
  },
  // timestamps record who joined or left the waitlist or trip first
  { timestamps: true }
);

// A user can only have one membership per trip
TripMembershipSchema.index({ tripId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('TripMembership', TripMembershipSchema);