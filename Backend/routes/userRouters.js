import express from "express";

import { createUser, loginUser } from "../controllers/userController.js";

// import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/sing-in", createUser);

export default router;