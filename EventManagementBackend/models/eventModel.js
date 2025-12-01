import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
    eventName:{
        type: String,
        required: [true, 'Event name is required'],
        trim: true,
        maxlength: [100, 'Event name cannot exceed 100 characters']
    },
    eventDate:{
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: function(value) {
                // Only validate for new events (when creating)
                // For updates, we'll handle validation in the controller
                if (this.isNew) {
                    return value > new Date();
                }
                return true;
            },
            message: 'Event date must be in the future'
        }
    },
    eventVenue:{
        type: String,
        required: [true, 'Event venue is required'],
        trim: true,
        maxlength: [200, 'Venue cannot exceed 200 characters']
    },
    eventHostedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Event host is required']
    },
    eventDescription:{
        type: String,
        required: [true, 'Event description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    TotalSeats:{
        type: Number,
        required: [true, 'Total seats is required'],
        min: [1, 'Total seats must be at least 1'],
        max: [10000, 'Total seats cannot exceed 10000']
    },
    eventCategory:{
        type: String,
        enum: ['Technology', 'Business', 'Health', 'Education', 'Entertainment', 'Sports', 'Other'],
        default: 'Other'
    },
    eventType:{
        type: String,
        enum: ['Online', 'Offline', 'Hybrid'],
        default: 'Offline'
    },
    eventPrice:{
        type: Number,
        default: 0,
        min: [0, 'Event price cannot be negative']
    },
    eventStatus:{
        type: String,
        enum: ['Active', 'Cancelled', 'Completed'],
        default: 'Active'
    },
    userRegistered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventRegister"
    }]
},{
    timestamps: true
});

// Index for better search performance
eventSchema.index({ eventName: 'text', eventDescription: 'text', eventVenue: 'text' });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ eventHostedBy: 1 });

export const Event = mongoose.model("Event", eventSchema);