import express from "express";
import { register, login, currentUser, getUserEvents, getUserRegisteredEvents, updateProfile, changePassword } from "../controllers/userController.js";
import validateToken from "../middleware/validTokenHandler.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/currentUser", validateToken, currentUser);
router.get("/myEvents", validateToken, getUserEvents);
router.get("/myRegistrations", validateToken, getUserRegisteredEvents);
router.put("/profile", validateToken, updateProfile);
router.put("/changePassword", validateToken, changePassword);

export default router;