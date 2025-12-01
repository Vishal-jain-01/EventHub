import asyncHandler from "express-async-handler";
import {Event} from "../models/eventModel.js";
import {EventRegister} from "../models/eventRegisterModel.js";
import {User} from "../models/userModel.js";
import {sendEventCreationEmail, sendRegistrationConfirmationEmail, sendEventFullyBookedEmail} from "../utils/emailService.js";

const getAllevents = asyncHandler(async (req , res)=>{
    const { search, limit = 10, page = 1, sortBy = 'eventDate', order = 'asc', category, includePast = 'false' } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Exclude past events by default (only for public listings)
    if (includePast === 'false') {
        filter.eventDate = { $gte: new Date() };
    }
    
    if(search) {
        filter.$or = [
            { eventName: { $regex: search, $options: 'i' } },
            { eventDescription: { $regex: search, $options: 'i' } },
            { eventVenue: { $regex: search, $options: 'i' } }
        ];
    }
    
    if(category && category !== 'all') {
        filter.eventCategory = category;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let events;
    
    if (sortBy === 'eventDate') {
        // Use aggregation pipeline for smart date sorting
        const now = new Date();
        const pipeline = [
            { $match: filter },
            {
                $addFields: {
                    isUpcoming: { $gte: ["$eventDate", now] },
                    timeUntilEvent: {
                        $cond: {
                            if: { $gte: ["$eventDate", now] },
                            then: { $subtract: ["$eventDate", now] },
                            else: { $subtract: [now, "$eventDate"] }
                        }
                    }
                }
            },
            {
                $sort: {
                    isUpcoming: -1,  // Upcoming events first
                    timeUntilEvent: 1  // Shortest time first for upcoming, most recent first for past
                }
            },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'users',
                    localField: 'eventHostedBy',
                    foreignField: '_id',
                    as: 'eventHostedBy',
                    pipeline: [{ $project: { name: 1, email: 1 } }]
                }
            },
            {
                $unwind: '$eventHostedBy'
            }
        ];
        
        events = await Event.aggregate(pipeline);
    } else {
        // Regular sorting for other fields
        const sortOrder = order === 'desc' ? -1 : 1;
        const sort = { [sortBy]: sortOrder };
        
        events = await Event.find(filter)
            .populate('eventHostedBy', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
    }
    
    const totalEvents = await Event.countDocuments(filter);
    
    const eventsWithCount = events.map(event => {
        // Handle both aggregation results and regular query results
        const eventObj = event.toObject ? event.toObject() : event;
        
        return {
            ...eventObj,
            registeredUsersCount: eventObj.userRegistered?.length || 0,
            availableSeats: eventObj.TotalSeats - (eventObj.userRegistered?.length || 0),
            isFullyBooked: (eventObj.userRegistered?.length || 0) >= eventObj.TotalSeats,
            userRegistered: undefined,
            // Remove aggregation helper fields
            isUpcoming: undefined,
            timeUntilEvent: undefined
        };
    });
    
    res.status(200).json({
        events: eventsWithCount,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalEvents / parseInt(limit)),
            totalEvents,
            hasNext: parseInt(page) < Math.ceil(totalEvents / parseInt(limit)),
            hasPrev: parseInt(page) > 1
        }
    });
});
const eventById = asyncHandler(async (req , res)=>{
    const eventAvailable = await Event.findById(req.params.id)
        .populate('eventHostedBy', 'name email')
        .populate({
            path: 'userRegistered',
            populate: {
                path: 'userId',
                select: 'name email'
            }
        });
        
    if(!eventAvailable){
        return res.status(404).json({message:"There is no event listed with this given id"});
    }

    const eventWithCount = {
        ...eventAvailable.toObject(),
        registeredUsersCount: eventAvailable.userRegistered.length,
        availableSeats: eventAvailable.TotalSeats - eventAvailable.userRegistered.length,
        isFullyBooked: eventAvailable.userRegistered.length >= eventAvailable.TotalSeats,
        registeredUsers: eventAvailable.userRegistered.map(reg => ({
            name: reg.name,
            email: reg.email,
            phone: reg.phone,
            registeredAt: reg.createdAt
        })),
        userRegistered: undefined
    };

    res.status(200).json(eventWithCount);
});
const createEvent = asyncHandler(async (req , res)=>{
    const{eventName, eventDate, eventVenue, eventDescription, TotalSeats, eventCategory, eventType, eventPrice} = req.body;
    if(!eventName|| !eventDate|| !eventVenue|| !eventDescription||!TotalSeats){
        return res.status(400).json({message:"All fields are mandatory"});
    }
    
    // Debug: Check if user is authenticated
    console.log("req.user:", req.user);
    console.log("req.user.id:", req.user?.id);
    
    if(!req.user || !req.user.id){
        return res.status(401).json({message:"User not authenticated"});
    }
    
    const createEvent = await Event.create({
        eventName,
        eventDate,
        eventVenue,
        eventHostedBy: req.user.id,
        eventDescription,
        TotalSeats,
        eventCategory: eventCategory || 'Other',
        eventType: eventType || 'Offline',
        eventPrice: eventPrice || 0
        
    });

    // Send event creation confirmation email
    try {
        const user = await User.findById(req.user.id);
        if (user && user.email) {
            await sendEventCreationEmail(user.email, user.name, {
                eventName: createEvent.eventName,
                eventDate: createEvent.eventDate,
                eventVenue: createEvent.eventVenue,
                TotalSeats: createEvent.TotalSeats,
                eventCategory: createEvent.eventCategory,
                eventType: createEvent.eventType,
                eventPrice: createEvent.eventPrice
            });
        }
    } catch (emailError) {
        console.error('Error sending event creation email:', emailError);
        // Don't fail the request if email fails
    }

    return res.status(201).json({message:"Event Successfully Created", createEvent});
});
const deleteEventById = asyncHandler(async (req , res)=>{
    // Debug: Check authentication
    console.log("req.user:", req.user);
    console.log("req.user.id:", req.user?.id);
    
    if(!req.user || !req.user.id){
        return res.status(401).json({message:"User not authenticated"});
    }
    
    const eventAvailable=await Event.findById(req.params.id);
    if(!eventAvailable){
        return res.status(404).json({message:"No event found with this id"});
    }
    
    if(req.user.id !== eventAvailable.eventHostedBy.toString()){
        return res.status(403).json({message:"You are not authorized to delete this event. Only the host can delete it."});
    }
    
    const deleteEvent = await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Event Deleted Successfully" , deleteEvent});
});
const eventRegisterById = asyncHandler(async (req , res)=>{
    const eventAvailable = await Event.findById(req.params.id).populate('eventHostedBy', 'name email');
    if(!eventAvailable){
        return res.status(404).json({message:"No event found with this id"});
    }
    
    // Check if event date has passed
    if(new Date(eventAvailable.eventDate) < new Date()) {
        return res.status(400).json({message:"Cannot register for past events"});
    }
    
    const {name , email , phone} = req.body;
    if(!name|| !email || !phone){
        return res.status(400).json({message:"All fields required"});
    }
    
    // Check if user already registered for this specific event
    const alreadyRegistered = await EventRegister.findOne({
        userId: req.user.id,
        eventId: req.params.id
    });
    
    if(alreadyRegistered){
        return res.status(403).json({message:"You are already registered for this event"});
    }
    
    if(eventAvailable.TotalSeats <= eventAvailable.userRegistered.length){
        return res.status(403).json({message:"Event is fully booked! No seats available"});
    }
    
    const registerForEvent = await EventRegister.create({
        name,
        email,
        phone,
        userId: req.user.id,
        eventId: req.params.id
    });
    
    eventAvailable.userRegistered.push(registerForEvent._id);
    await eventAvailable.save();
    
    // Send registration confirmation email to user
    try {
        await sendRegistrationConfirmationEmail(email, name, {
            eventName: eventAvailable.eventName,
            eventDate: eventAvailable.eventDate,
            eventVenue: eventAvailable.eventVenue,
            eventCategory: eventAvailable.eventCategory,
            eventType: eventAvailable.eventType,
            eventPrice: eventAvailable.eventPrice || 0
        }, {
            registrationId: registerForEvent._id,
            name: name,
            email: email,
            phone: phone
        });
    } catch (emailError) {
        console.error('Error sending registration confirmation email:', emailError);
        // Don't fail the request if email fails
    }
    
    // Check if event is now fully booked and notify host
    const isNowFullyBooked = eventAvailable.userRegistered.length >= eventAvailable.TotalSeats;
    if (isNowFullyBooked && eventAvailable.eventHostedBy && eventAvailable.eventHostedBy.email) {
        try {
            await sendEventFullyBookedEmail(
                eventAvailable.eventHostedBy.email,
                eventAvailable.eventHostedBy.name,
                {
                    eventName: eventAvailable.eventName,
                    eventDate: eventAvailable.eventDate,
                    eventVenue: eventAvailable.eventVenue,
                    TotalSeats: eventAvailable.TotalSeats
                }
            );
        } catch (emailError) {
            console.error('Error sending event fully booked email:', emailError);
            // Don't fail the request if email fails
        }
    }
    
    res.status(200).json({
        message: `Successfully registered for ${eventAvailable.eventName}`,
        registration: {
            eventName: eventAvailable.eventName,
            eventDate: eventAvailable.eventDate,
            eventVenue: eventAvailable.eventVenue,
            registrationId: registerForEvent._id
        },
        totalRegistered: eventAvailable.userRegistered.length,
        availableSeats: eventAvailable.TotalSeats - eventAvailable.userRegistered.length,
        isFullyBooked: isNowFullyBooked
    });
});

// Update event
const updateEvent = asyncHandler(async (req, res) => {
    const { eventName, eventDate, eventVenue, eventDescription, TotalSeats, eventCategory, eventType, eventPrice } = req.body;
    
    const eventAvailable = await Event.findById(req.params.id);
    if(!eventAvailable){
        return res.status(404).json({message:"Event not found"});
    }
    
    // Check if user is the host
    if(req.user.id !== eventAvailable.eventHostedBy.toString()){
        return res.status(403).json({message:"You are not authorized to update this event"});
    }
    
    // Don't allow reducing seats below current registrations
    if(TotalSeats && TotalSeats < eventAvailable.userRegistered.length) {
        return res.status(400).json({
            message: `Cannot reduce seats below current registrations (${eventAvailable.userRegistered.length})`
        });
    }

    // Custom validation for event date changes
    if(eventDate) {
        const newEventDate = new Date(eventDate);
        const currentEventDate = new Date(eventAvailable.eventDate);
        const now = new Date();
        
        // If trying to change date to past (and it wasn't already in past)
        if(newEventDate < now && currentEventDate >= now) {
            return res.status(400).json({
                message: "Cannot change event date to the past"
            });
        }
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { 
            eventName, 
            eventDate, 
            eventVenue, 
            eventDescription, 
            TotalSeats,
            eventCategory,
            eventType,
            eventPrice
        },
        { new: true, runValidators: true }
    ).populate('eventHostedBy', 'name email');
    
    res.status(200).json({
        message: "Event updated successfully",
        event: {
            ...updatedEvent.toObject(),
            registeredUsersCount: updatedEvent.userRegistered.length,
            availableSeats: updatedEvent.TotalSeats - updatedEvent.userRegistered.length,
            userRegistered: undefined
        }
    });
});

// Cancel registration
const cancelRegistration = asyncHandler(async (req, res) => {
    const eventAvailable = await Event.findById(req.params.id);
    if(!eventAvailable){
        return res.status(404).json({message:"Event not found"});
    }
    
    // Find user's registration for this event
    const registration = await EventRegister.findOne({
        userId: req.user.id,
        eventId: req.params.id
    });
    
    if(!registration) {
        return res.status(404).json({message:"You are not registered for this event"});
    }
    
    // Check if event is within cancellation period (e.g., 24 hours before)
    const eventDate = new Date(eventAvailable.eventDate);
    const now = new Date();
    const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
    
    if(hoursUntilEvent < 24) {
        return res.status(400).json({
            message: "Cannot cancel registration less than 24 hours before the event"
        });
    }
    
    // Remove registration
    eventAvailable.userRegistered = eventAvailable.userRegistered.filter(
        regId => regId.toString() !== registration._id.toString()
    );
    await eventAvailable.save();
    await EventRegister.findByIdAndDelete(registration._id);
    
    res.status(200).json({
        message: `Successfully cancelled registration for ${eventAvailable.eventName}`,
        refundEligible: true
    });
});

// Get event statistics (for event host)
const getEventStats = asyncHandler(async (req, res) => {
    const eventAvailable = await Event.findById(req.params.id);
    
    if(!eventAvailable){
        return res.status(404).json({message:"Event not found"});
    }
    
    // Check if user is the host
    if(req.user.id !== eventAvailable.eventHostedBy.toString()){
        return res.status(403).json({message:"You are not authorized to view these statistics"});
    }
    
    // Get all registered users for this event
    const registeredUsers = await EventRegister.find({ eventId: req.params.id })
        .sort({ createdAt: -1 });
    
    const stats = {
        eventName: eventAvailable.eventName,
        totalSeats: eventAvailable.TotalSeats,
        registeredUsers: registeredUsers.length,
        availableSeats: eventAvailable.TotalSeats - registeredUsers.length,
        occupancyRate: ((registeredUsers.length / eventAvailable.TotalSeats) * 100).toFixed(2) + '%',
        attendees: registeredUsers.map(reg => ({
            _id: reg._id,
            name: reg.name,
            email: reg.email,
            phone: reg.phone,
            registeredAt: reg.createdAt
        }))
    };
    
    res.status(200).json(stats);
});

// Auto-complete past events
const autoCompleteEvents = asyncHandler(async (req, res) => {
    try {
        const now = new Date();
        
        // Find all events that have passed and are still marked as 'Active'
        const pastEvents = await Event.find({
            eventDate: { $lt: now },
            eventStatus: 'Active'
        });
        
        // Update their status to 'Completed'
        if (pastEvents.length > 0) {
            await Event.updateMany(
                {
                    eventDate: { $lt: now },
                    eventStatus: 'Active'
                },
                {
                    eventStatus: 'Completed'
                }
            );
            
            console.log(`Auto-completed ${pastEvents.length} past events`);
        }
        
        res.status(200).json({
            message: `${pastEvents.length} events auto-completed`,
            completedEvents: pastEvents.length
        });
    } catch (error) {
        console.error('Error auto-completing events:', error);
        res.status(500).json({ message: 'Failed to auto-complete events' });
    }
});

// Check registration status
const checkRegistrationStatus = asyncHandler(async (req, res) => {
    const eventAvailable = await Event.findById(req.params.id);
    if(!eventAvailable){
        return res.status(404).json({message:"Event not found"});
    }
    
    const registration = await EventRegister.findOne({
        userId: req.user.id,
        eventId: req.params.id
    });
    
    res.status(200).json({
        isRegistered: !!registration,
        registrationId: registration?._id || null,
        registeredAt: registration?.createdAt || null
    });
});

export {getAllevents, eventById, eventRegisterById, deleteEventById, createEvent, updateEvent, cancelRegistration, getEventStats, autoCompleteEvents, checkRegistrationStatus};
