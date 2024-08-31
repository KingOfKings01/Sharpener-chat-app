import express from "express";
import multer from 'multer';

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

import { createUser, getAllUsers, getMessages, loginUser, uploadFile } from "../controllers/userController.js";
import { authorization } from "../middleware/auth.js";

const router = express.Router();

// Route for user registration
router.post("/sign-in", createUser);

// Route for user login
router.post("/login", loginUser);

// Route to get all messages for a specific user (requires authorization)
router.get("/get-messages", authorization, getMessages);

// Route to handle file upload (requires authorization)
router.post("/uploadFile", authorization, upload.single('file'), uploadFile);

// Route to get all users (requires authorization)
router.get("/get-Users", authorization, getAllUsers);

export default router;
