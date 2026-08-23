const mongoose = require('mongoose');

const TripMembershipSchema = new mongoose.Schema(
    {
    tripId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        enum: ['confirmed', 'waitlisted'],
        default: 'confirmed'
    },
},
    { timestamps: true }//first to join  waitlist, first to leave waitlist, first to join trip, first to leave trip
);

module.exports = mongoose.model('TripMembership', TripMembershipSchema);