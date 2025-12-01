import mongoose from "mongoose";
const eventRegisterSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required:true
    }

}, {
    timestamps:true
})

eventRegisterSchema.index({ email: 1, eventId: 1 }, { unique: true });
export const EventRegister = mongoose.model("EventRegister", eventRegisterSchema);