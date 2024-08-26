import express from "express";
import { authorization } from "../middleware/auth.js";

// Import group routes
import {
  // addUserToGroup,
  createGroup,
  getGroups,
} from "../controllers/groupController.js";

const router = express.Router();

// Group routes
router.post("/create", authorization, createGroup);
// router.post("/add-user", authorization, addUserToGroup);
router.get('/user-groups', authorization, getGroups);


export default router;