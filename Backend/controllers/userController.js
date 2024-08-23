import User from "../models/User.js";
import Message from "../models/Message.js";
import { Op } from "sequelize";

// Create a new message using User model
export const createMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageText = req.body.message;

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the message using the User model's association method
    const newMessage = await user.createMessage({ message: messageText });

    const response = {
      id: newMessage.id,
      name: "You",
      message: newMessage.message,
      createdAt: newMessage.createdAt
    };

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while creating the message" });
  }
};

// Get all messages for all users, optionally starting from a specific message ID
export const getUserMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { lastMessageId } = req.query; // Get last message ID from query parameter

    // Find all users and their messages, optionally starting from a specific message ID
    const users = await User.findAll({
      attributes: ["id", "name"], // Include the user's name
      include: [
        {
          model: Message,
          as: "messages",
          attributes: ["id", "message", "createdAt"], // Include message ID and createdAt for sorting
          where: {
            ...(lastMessageId && { id: { [Op.gt]: lastMessageId } }) // Fetch messages with ID greater than lastMessageId
          },
          order: [['createdAt', 'ASC']] // Ensure messages are ordered by creation time
        }
      ],
    });

    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    // Construct the response as an array of objects with name and message
    const response = users.flatMap(user => 
      user.messages.map(msg => ({
        id: msg.id,
        name: user.id === currentUserId ? "You" : user.name,
        message: msg.message,
        createdAt: msg.createdAt
      }))
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort by creation time

    console.table(response);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while fetching messages" });
  }
};


// Create a new User
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

      res.status(200).json({ token });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
    res.status(200).json({token});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
