import Group from "../models/Group.js";
import GroupMember from "../models/GroupMember.js";
import User from "../models/User.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";

//Todo: Get groups where the user is a member
export const getGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find groups where the user is a member
    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          where: { userId },
          attributes: ["role"], // Get role attributes (admin or member)
        },
      ],
      attributes: ["id", "name"], // Only return the group's id and name
    });

    if (groups.length === 0) {
      return res.status(404).json({ message: "No groups found." });
    }

    const groupsWithRoles = groups.map((group) => ({
      ...group.dataValues,
      role: group.GroupMembers[0]?.dataValues.role,
    }));

    return res.status(200).json(groupsWithRoles);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching groups." });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const groupId = req.groupId;

    // Find group members
    const groupMembers = await GroupMember.findAll({
      where: { groupId },
      attributes: ["role"],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"], // Select fields from the User model
        },
      ],
      raw : true,
    });
    

    if (!groupMembers.length) {
      return res
        .status(404)
        .json({ message: "No members found in this group." });
    }

    const transformKeys = (arr) => {
      return arr.map(item => {
        const newItem = {};
        for (const [key, value] of Object.entries(item)) {
          // Remove 'User.' prefix and add to new object
          newItem[key.replace(/^User\./, '')] = value;
        }
        return newItem;
      });
    };

    const members = transformKeys(groupMembers)

    // const members = groupMembers.map((member) => member.User);
    console.log(members[0]);
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching group members:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching group members." });
  }
};

export const getNonGroupMembers = async (req, res) => {
  try {
    const groupId = req.groupId;

    // Get the IDs of all users who are members of the group
    const groupMemberIds = await GroupMember.findAll({
      where: { groupId },
      attributes: ["userId"], // Fetch only the userId
    }).then((members) => members.map((member) => member.userId));

    // Find users who are not part of the group
    const nonGroupMembers = await User.findAll({
      where: {
        id: {
          [Op.notIn]: groupMemberIds, // Users not in the group
        },
      },
      attributes: ["id", "name", "email"], // Fetch relevant user details
    });

    // if (!nonGroupMembers.length) {
    //   return res.status(404).json({ message: "All users are members of this group." });
    // }

    return res.status(200).json(nonGroupMembers);
  } catch (error) {
    console.error("Error fetching non-group members:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching non-group members." });
  }
};

//Todo: Create a new group with transaction handling
export const createGroup = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start transaction
  try {
    const { name, members } = req.body;
    const adminId = req.user.id;

    // Create the group
    const newGroup = await Group.create(
      {
        name,
        createdById: adminId,
      },
      { transaction }
    );

    // Find users by their emails
    const users = await User.findAll({
      where: {
        email: members,
      },
      attributes: ["id"], // We only need the user IDs
    });

    // If some emails don't match any user, handle it (optional)
    if (users.length !== members.length) {
      await transaction.rollback(); // Rollback transaction if some users are not found
      return res.status(404).json({ message: "Some users not found." });
    }

    // Create group members
    const groupMembers = users.map((user) => ({
      groupId: newGroup.id,
      userId: user.id,
    }));

    // Include the admin as a member of the group
    groupMembers.push({ groupId: newGroup.id, userId: adminId, role: "admin" });

    // Insert the members into the GroupMember table
    await GroupMember.bulkCreate(groupMembers, { transaction });

    await transaction.commit(); // Commit transaction if everything is successful

    return res
      .status(201)
      .json({ message: "Group created successfully", groupId: newGroup.id });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction in case of error
    return res
      .status(500)
      .json({ message: "An error occurred while creating the group." });
  }
};

export const addUserToGroup = async (req, res) => {
  try {
    const userId = req.body.addUserId;
    const groupId = req.groupId;

    // Check if the user is already in the group
    const existingMember = await GroupMember.findOne({
      where: { groupId, userId },
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this group." });
    }

    // Add the user to the group
    await GroupMember.create({
      groupId,
      userId,
      role: "member", // Default role for new members
    });

    return res
      .status(201)
      .json({ message: "User added to the group successfully." });
  } catch (err) {
    console.error("Error adding user to group:", err);
    return res
      .status(500)
      .json({
        message: "An error occurred while adding the user to the group.",
      });
  }
};

export const removeUserFromGroup = async (req, res) => {
  try {

    const userId = req.body.addUserId;
    const groupId = req.groupId;


    // Check if the user is part of the group
    const groupMember = await GroupMember.findOne({
      where: { groupId, userId },
    });


    if (!groupMember) {
      return res.status(404).json({ message: "User not found in this group." });
    }

    // Delete the user from the group
    await GroupMember.destroy({
      where: { groupId, userId },
    });

    return res
      .status(200)
      .json({ message: "User removed from group successfully." });
  } catch (error) {
    console.error("Error deleting member:", error);
    return res
      .status(500)
      .json({
        message: "An error occurred while removing the member from the group.",
      });
  }
};

export const updateMemberToAdmin = async (req, res) => {
  try {
    const userId = req.body.addUserId;
    const groupId = req.groupId;

    // Check if the user is part of the group
    const groupMember = await GroupMember.findOne({
      where: { groupId, userId },
    });

    if (!groupMember) {
      return res.status(404).json({ message: "User not found in this group." });
    }

    // Update the user's role to admin
    groupMember.role = "admin";
    await groupMember.save();

    return res.status(200).json({ message: "User role updated to admin successfully." });
  } catch (error) {
    console.error("Error updating member to admin:", error);
    return res.status(500).json({ message: "An error occurred while updating the member's role." });
  }
};
