import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  addMembers,
  leaveGroup,
  listMyGroups,
  getGroupDetails,
  getGroupMessages,
  sendGroupMessage,
  updateGroupAvatar,
} from "../controllers/group.controller.js";

const router = express.Router();

router.get("/", protectRoute, listMyGroups);
router.post("/", protectRoute, createGroup);
router.post("/:groupId/members", protectRoute, addMembers);
router.post("/:groupId/leave", protectRoute, leaveGroup);
router.get("/:groupId", protectRoute, getGroupDetails);
router.get("/:groupId/messages", protectRoute, getGroupMessages);
router.post("/:groupId/messages", protectRoute, sendGroupMessage);
router.post("/:groupId/avatar", protectRoute, updateGroupAvatar);

export default router;


