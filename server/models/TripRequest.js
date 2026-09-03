const mongoose = require('mongoose');

const TripRequestSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        destinationRequest:{
            type: String,
            required: true
        },
        preferredDate:{
            type: String
        },
        notes:{
         type: String
        },
        status:{
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        adminResponse:{
            type: String
        },
    },
        { timestamps: true }
    );

module.exports = mongoose.model('TripRequest', TripRequestSchema);
