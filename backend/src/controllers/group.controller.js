import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import { io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const createGroup = async (req, res) => {
  try {
    const { name, memberIds = [], avatar } = req.body;
    const creatorId = req.user._id;

    const uniqueMembers = Array.from(new Set([creatorId.toString(), ...memberIds.map(String)]));

    const group = await Group.create({
      name,
      createdBy: creatorId,
      members: uniqueMembers,
      avatar: avatar || "",
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberIds = [] } = req.body;
    const userId = req.user._id.toString();

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (!group.members.map(String).includes(userId)) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    const updatedMembers = Array.from(new Set([...group.members.map(String), ...memberIds.map(String)]));
    group.members = updatedMembers;
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id.toString();

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.members = group.members.filter((m) => m.toString() !== userId);

    // If creator leaves and no members left, delete group
    if (group.members.length === 0) {
      await Group.findByIdAndDelete(groupId);
      // Optionally delete messages
      await Message.deleteMany({ groupId });
      return res.status(200).json({ message: "Group deleted" });
    }

    await group.save();

    // Create a system message indicating user left
    const systemMessage = await Message.create({
      senderId: req.user._id,
      groupId,
      text: `👋 ${req.user.fullName || "Một thành viên"} đã rời nhóm`,
    });
    // Emit to group room
    io.to(`group:${groupId}`).emit("newGroupMessage", systemMessage);

    res.status(200).json({ message: "Left group" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate({ path: "members", select: "fullName profilePic" });
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id.toString();

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (!group.members.map(String).includes(userId)) {
      return res.status(403).json({ error: "Not a group member" });
    }

    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (!group.members.map(String).includes(senderId.toString())) {
      return res.status(403).json({ error: "Not a group member" });
    }

    if (!text && !image) {
      return res.status(400).json({ error: "Tin nhn rng" });
    }

    const newMessage = await Message.create({ senderId, groupId, text, image });
    io.to(`group:${groupId}`).emit("newGroupMessage", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGroupAvatar = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { image } = req.body; // base64 hoặc URL
    const userId = req.user._id.toString();

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (!group.members.map(String).includes(userId)) {
      return res.status(403).json({ error: "Not a group member" });
    }

    let imageUrl = image;
    if (image && !image.startsWith("data:image")) {
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
          const uploadResponse = await cloudinary.uploader.upload(image, { folder: "group_avatars" });
          imageUrl = uploadResponse.secure_url;
        }
      } catch (e) {
        imageUrl = image; // fallback
      }
    }

    group.avatar = imageUrl;
    await group.save();

    io.to(`group:${groupId}`).emit("groupUpdated", { _id: groupId, avatar: group.avatar });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


