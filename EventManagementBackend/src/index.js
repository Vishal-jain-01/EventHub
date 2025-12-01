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

// CORS configuration for production and development
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.CORS_ORIGIN === '*') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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