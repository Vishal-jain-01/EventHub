import asyncHandler from "express-async-handler";
import {Event} from "../models/eventModel.js";

// Middleware to auto-complete past events
const autoCompleteEventsMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const now = new Date();
        
        // Update past events to 'Completed' status silently
        await Event.updateMany(
            {
                eventDate: { $lt: now },
                eventStatus: 'Active'
            },
            {
                eventStatus: 'Completed'
            }
        );
        
        next();
    } catch (error) {
        console.error('Error in auto-complete middleware:', error);
        next(); // Continue even if this fails
    }
});

export default autoCompleteEventsMiddleware;