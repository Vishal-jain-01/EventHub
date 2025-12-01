import express from "express";
const router = express.Router();
import {getAllevents, eventById, eventRegisterById, deleteEventById, createEvent, updateEvent, cancelRegistration, getEventStats, autoCompleteEvents, checkRegistrationStatus} from "../controllers/eventController.js";
import validateToken from "../middleware/validTokenHandler.js";

// Public routes
router.get("/allevents", getAllevents);
router.get("/event/:id", eventById);
router.post("/autoComplete", autoCompleteEvents); // Can be called by cron or manually

// Protected routes
router.post("/event", validateToken, createEvent);
router.put("/event/:id", validateToken, updateEvent);
router.delete("/deleteEvent/:id", validateToken, deleteEventById);
router.post("/eventRegister/:id", validateToken, eventRegisterById);
router.delete("/cancelRegistration/:id", validateToken, cancelRegistration);
router.get("/registrationStatus/:id", validateToken, checkRegistrationStatus);
router.get("/stats/:id", validateToken, getEventStats);

export default router;