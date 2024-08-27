import GroupMember from '../models/GroupMember.js';

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.params; // Assuming groupId is passed in the request parameters

    // Check if the user is an admin of the group
    const groupMember = await GroupMember.findOne({
      where: {
        groupId,
        userId,
        role: 'admin', // Check if the user is an admin
      },
    });

    if (!groupMember) {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    // If the user is an admin, proceed to the next middleware or controller
    req.adminUserId = userId; // You can pass the userId if needed
    next();
  } catch (error) {
    console.error("Error checking admin role:", error);
    return res.status(500).json({ message: "An error occurred while checking admin role." });
  }
};
