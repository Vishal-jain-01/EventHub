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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Auto-complete past events middleware
app.use(autoCompleteEventsMiddleware);

app.use("/event", eventRoute);
app.use("/user", userRoute);

app.listen(process.env.PORT ,()=>{
    console.log("App is listening on PORT : ", process.env.PORT)
})