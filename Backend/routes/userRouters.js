import express from "express";

import { createUser, loginUser } from "../controllers/userController.js";

// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/sign-in", createUser);
router.post("/login", loginUser);

export default router;