import express from "express";

import { createMessage, createUser, getUserMessages, loginUser } from "../controllers/userController.js";

import { authorization } from "../middleware/auth.js";

const router = express.Router();

router.post("/sign-in", createUser);
router.post("/login", loginUser);

// Create a new message for a user
router.post("/create-message",authorization, createMessage);

// Get all messages for a specific user
router.get("/get-messages", authorization,  getUserMessages);

export default router;