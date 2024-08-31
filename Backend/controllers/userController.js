import { Op } from "sequelize";
import User from "../models/User.js";
import Message from "../models/Message.js";
import AWSService from "../services/awsService.js";

//Todo: Create a new message using User model
// export const createMessage = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { message: messageText, recipientEmail, groupId } = req.body;
//     const io = req.io; // Access the io instance attached to req

//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let response = {};

//     if (groupId) {
//       const group = await Group.findByPk(groupId);
//       if (!group) {
//         return res.status(404).json({ message: "Group not found" });
//       }

//       const newMessage = await Message.create({
//         message: messageText,
//         userId,
//         groupId,
//       });

//       response = {
//         id: newMessage.id,
//         sender: "You",
//         recipient: null,
//         message: newMessage.message,
//         createdAt: newMessage.createdAt,
//         groupId: newMessage.groupId,
//       };

//       // Emit the message to the group room
//       io.to(groupId).emit("newMessage", response);
//     } else if (recipientEmail) {
//       const recipient = await User.findOne({
//         where: { email: recipientEmail },
//       });

//       if (!recipient) {
//         return res.status(404).json({ message: "Recipient not found" });
//       }

//       const newMessage = await Message.create({
//         message: messageText,
//         userId,
//         recipientId: recipient.id,
//       });

//       response = {
//         id: newMessage.id,
//         sender: "You",
//         recipient: recipient.name,
//         message: newMessage.message,
//         createdAt: newMessage.createdAt,
//         groupId: null,
//       };

//       // Emit the message to the recipient's private room
//       io.to(recipient.id).emit('newMessage', response);
//     } else {
//       return res.status(400).json({
//         message: "Either recipientEmail or groupId must be provided.",
//       });
//     }

//     return res.status(201).json(response);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "An error occurred while creating the message" });
//   }
// };

//Todo: Get all messages for all users, optionally starting from a specific message ID
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { recipientEmail, groupId } = req.query;

    if (!recipientEmail && !groupId) {
      return res.status(400).json({
        message: "Either recipientEmail or groupId must be provided.",
      });
    }

    if (recipientEmail && groupId) {
      return res.status(400).json({
        message: "Cannot provide both recipientEmail and groupId.",
      });
    }

    let messages = [];

    if (groupId) {
      // Fetch group messages
      const groupMessages = await Message.findAll({
        where: {
          groupId: groupId,
        },
        include: [
          {
            model: User, // Include the User model to get sender information
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "ASC"]], // Sort messages by creation time
      });

      groupMessages.forEach((message) => {
        const isCurrentUserSender = message.userId === currentUserId;
        messages.push({
          sender: isCurrentUserSender ? "You" : message.User.name,
          id: message.id,
          message: message.message,
          createdAt: message.createdAt,
          url: message.fileUrl || null, // Include URL if available
        });
      });
    } else if (recipientEmail) {
      // Fetch individual messages
      const recipient = await User.findOne({
        attributes: ["id", "name"],
        where: {
          email: recipientEmail,
        },
      });

      const recipientId = recipient ? recipient.dataValues.id : null;
      const recipientName = recipient ? recipient.dataValues.name : null;

      const data = await Message.findAll({
        where: {
          [Op.or]: [
            { userId: currentUserId, recipientId }, // Messages sent by the current user
            { userId: recipientId, recipientId: currentUserId }, // Messages received by the current user
          ],
        },
        order: [["createdAt", "ASC"]], // Sort messages by creation time
      });

      data.forEach((message) => {
        const isCurrentUserSender = message.userId === currentUserId;
        messages.push({
          sender: isCurrentUserSender ? "You" : recipientName,
          id: message.id,
          message: message.message,
          createdAt: message.createdAt,
          url: message.fileUrl || null, // Include URL if available
        });
      });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching messages" });
  }
};

//Todo: Get all Users
export const getAllUsers = async (req, res) => {
  const userId = req.user.id;
  try {
    const users = await User.findAll({
      attributes: ["name", "email"],
      where: {
        id: { [Op.ne]: userId }, // Exclude the user with the matching userId
      },
    });

    if (!users.length) {
      // Simplified check
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "An error occurred while fetching users" });
  }
};

//Todo: Create a new User (Sign-in)
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const data = {
      name,
      email,
      phone,
      password,
    };

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      //todo: hook will be called when user is created from encrypting password.

      const user = await User.create(data);

      const token = User.generateToken({
        id: user.id,
        name: user.name,
      });

      res.status(200).json({ token, email: user.email, username: user.name });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Todo: Login a User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const token = User.generateToken({ id: user.id, name: user.name });
    res.status(200).json({ token, email: user.email, username: user.name });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ensure file is present in req.file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    
    const { originalname, mimetype, buffer } = req.file;
    const key = `${userId}${Date.now()}-${originalname}`;
    console.log(key, buffer, mimetype);

    const awsService = new AWSService();
    const uploadResult = await awsService.uploadToS3(key, buffer, mimetype);
    return res.status(200).json({ url: uploadResult.Location });

  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ message: "Internal Server Error - Error uploading file" });
  }
};
