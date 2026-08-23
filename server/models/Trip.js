const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        coordinates:{
            type: [Number], 
            required: true
        },
        date:{
            type: Date,
            required: false,
        },
        category:{
            type: String,
            required: true,
        },
        capacity:{
            type: Number,
            required: true,
        },
        pricePerPerson:{
            type: Number,
            required: true
        },
        totalPrice:{
            type: Number,
            required:true
        },

        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        
        images: {
            type: [String],
            validate: {
              validator: function (arr) {
              return arr.length <= 6;
            },
            message: "You can only add up to 6 images."
        }
    },
        videos: {
            type: [String],
            default: []
    },
        status:{
            type: String,
            enum: ['upcoming', 'open', 'full','completed', 'cancelled'],
            default: 'open'
        },
        itinerary: [{
            day: {
                type: Number,
                required: true
            },
            activities: {
                type: String,
                required: true
            },
            place:{
                type: String,
                required: true  
            }
        }],

        placeSuggestions: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            place: String,
            note: String,
            status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' }
        }],
        
    
        weatherCache:{
            temperature: Number,
            condition: String,
            lastUpdated: Date
        }
    });

module.exports = mongoose.model('Trip', TripSchema);