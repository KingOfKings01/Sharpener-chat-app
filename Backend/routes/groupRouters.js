import express from "express";
import { authorization } from "../middleware/auth.js";
import { isAdmin } from '../middleware/isAdmin.js'

// Import group routes
import {
  addUserToGroup,
  createGroup,
  getGroups,
  getGroupMembers,
  getNonGroupMembers,
  removeUserFromGroup,
  updateMemberToAdmin
} from "../controllers/groupController.js";

const router = express.Router();

// Group routes
router.post("/create", authorization, createGroup);
router.get('/user-groups', authorization, getGroups);


router.post("/add-user", authorization, isAdmin, addUserToGroup);
router.post("/remove-user", authorization, isAdmin, removeUserFromGroup);
router.put("/user-to-admin", authorization, isAdmin, updateMemberToAdmin);
router.post('/get-members', authorization, isAdmin, getGroupMembers);
router.post('/get-non-members', authorization, isAdmin, getNonGroupMembers);


export default router;