import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventRoute from "../routes/eventRoutes.js";
import connectDb from "../config/dbconfig.js";
import userRoute from "../routes/userRoute.js";
import autoCompleteEventsMiddleware from "../middleware/autoCompleteEvents.js";

dotenv.config({
    path:"./.env"
})
connectDb();

const app = express();

// CORS configuration for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Auto-complete past events middleware
app.use(autoCompleteEventsMiddleware);

app.use("/event", eventRoute);
app.use("/user", userRoute);

// Health check endpoint for Render
app.get("/", (req, res) => {
    res.json({ message: "EventHub Backend API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("App is listening on PORT : ", PORT)
})