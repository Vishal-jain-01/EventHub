import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email:{
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password:{
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    phone:{
        type: String,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    lastLogin:{
        type: Date
    }
},{
    timestamps: true
});

// Index for better search performance
userSchema.index({ email: 1 });

export const User = mongoose.model("User", userSchema);