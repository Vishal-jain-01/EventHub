import asyncHandler from "express-async-handler";
import {User} from "../models/userModel.js";
import {Event} from "../models/eventModel.js";
import {EventRegister} from "../models/eventRegisterModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const register = asyncHandler(async (req, res)=>{
    const{name, email , password}=req.body;
    if(!name|| !email|| !password){
        return res.status(400).json({message:"Fill all fields"});
    }
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        return res.status(400).json({message:"User registered Before! Try to login with your credentials"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const register = await User.create({
        name, email , password : hashedPassword
    });
    if(register){
        return res.status(201).json({_id:register._id, email: register.email,message:"User registered successfully"});
    }
    else{
    return res.status(400).json({message:"User not registered! Try again something went wrong"});}
})
const login = asyncHandler(async (req, res)=>{
    const{email, password}=req.body;
    if(!email|| !password){
        return res.status(400).json({message:"Fill all fields"});
    }
    const userAvailable = await User.findOne({email});
    if(!userAvailable.email ){
        return res.status(404).json({message:"User email is missing"});
    }
    if(!userAvailable.password ){
        return res.status(404).json({message:"User passowrd is missing"});
    }
    const isPasswordValid = await bcrypt.compare(password, userAvailable.password);
    if(isPasswordValid){
        const accessToken  = jwt.sign({
            user: {
                name:userAvailable.name,
                email:userAvailable.email,
                id:userAvailable.id
            }
        },process.env.ACCESSTOKEN, {expiresIn:"15m"});
        res.status(200).json({accessToken});
    }
    else{
        res.status(401).json({message:"User unauthorized"});
    }
})
const currentUser = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user.id).select('-password');
    if(!user) {
        return res.status(404).json({message: "User not found"});
    }
    return res.status(200).json(user);
})

// Get user's created events
const getUserEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({eventHostedBy: req.user.id})
        .populate('eventHostedBy', 'name email')
        .sort({createdAt: -1});
    
    const eventsWithStats = events.map(event => ({
        ...event.toObject(),
        registeredUsersCount: event.userRegistered.length,
        availableSeats: event.TotalSeats - event.userRegistered.length,
        userRegistered: undefined
    }));
    
    res.status(200).json(eventsWithStats);
});

// Get user's registered events
const getUserRegisteredEvents = asyncHandler(async (req, res) => {
    const registrations = await EventRegister.find({userId: req.user.id})
        .populate('eventId');
    
    const eventsWithStats = registrations
        .filter(reg => reg.eventId) // Filter out null eventIds
        .map(reg => ({
            ...reg.eventId.toObject(),
            registrationId: reg._id,
            registeredAt: reg.createdAt,
            registeredUsersCount: reg.eventId.userRegistered.length,
            availableSeats: reg.eventId.TotalSeats - reg.eventId.userRegistered.length,
            userRegistered: undefined
        }))
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    
    res.status(200).json(eventsWithStats);
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    
    if(!name || !email) {
        return res.status(400).json({message: "Name and email are required"});
    }
    
    // Check if email is already taken by another user
    const existingUser = await User.findOne({email, _id: {$ne: req.user.id}});
    if(existingUser) {
        return res.status(400).json({message: "Email already taken by another user"});
    }
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {name, email},
        {new: true, runValidators: true}
    ).select('-password');
    
    res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
    });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if(!currentPassword || !newPassword) {
        return res.status(400).json({message: "Current and new passwords are required"});
    }
    
    const user = await User.findById(req.user.id);
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if(!isCurrentPasswordValid) {
        return res.status(401).json({message: "Current password is incorrect"});
    }
    
    if(newPassword.length < 6) {
        return res.status(400).json({message: "New password must be at least 6 characters"});
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, {password: hashedNewPassword});
    
    res.status(200).json({message: "Password changed successfully"});
});

export {register, login, currentUser, getUserEvents, getUserRegisteredEvents, updateProfile, changePassword};
