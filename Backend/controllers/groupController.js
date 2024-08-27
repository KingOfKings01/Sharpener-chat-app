import Group from '../models/Group.js';
import GroupMember from '../models/GroupMember.js';
import User from '../models/User.js';
import sequelize from "../config/database.js";

//Todo: Get groups where the user is a member
export const getGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find groups where the user is a member
    const groups = await Group.findAll({
      include: [{
        model: GroupMember,
        where: { userId },
        attributes: ["role"], // Get role attributes (admin or member)
      }],
      attributes: ['id', 'name'], // Only return the group's id and name
    });

    if (groups.length === 0) {
      return res.status(404).json({ message: "No groups found." });
    }

    const groupsWithRoles = groups.map(group => ({
      ...group.dataValues,
      role: group.GroupMembers[0]?.dataValues.role
    }));

    console.log();
    console.table(groups);
    console.log(groupsWithRoles);

    return res.status(200).json(groupsWithRoles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred while fetching groups." });
  }
};

//Todo: Create a new group with transaction handling
export const createGroup = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start transaction
  try {
    const { name, members } = req.body;
    const adminId = req.user.id;
    
    // Create the group
    const newGroup = await Group.create({
      name,
      createdById : adminId,
    }, { transaction });
    
    // Find users by their emails
    const users = await User.findAll({
      where: {
        email: members,
      },
      attributes: ['id'], // We only need the user IDs
    });

    // If some emails don't match any user, handle it (optional)
    if (users.length !== members.length) {
      await transaction.rollback(); // Rollback transaction if some users are not found
      return res.status(404).json({ message: "Some users not found." });
    }

    // Create group members
    const groupMembers = users.map(user => ({
      groupId: newGroup.id,
      userId: user.id,
    }));

    // Include the admin as a member of the group
    groupMembers.push({ groupId: newGroup.id, userId: adminId, role: "admin" });

    // Insert the members into the GroupMember table
    await GroupMember.bulkCreate(groupMembers, { transaction });

    await transaction.commit(); // Commit transaction if everything is successful

    return res.status(201).json({ message: "Group created successfully", groupId: newGroup.id });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction in case of error
    return res.status(500).json({ message: "An error occurred while creating the group." });
  }
};