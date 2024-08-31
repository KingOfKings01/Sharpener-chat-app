import Message from "../models/Message.js";
import Group from "../models/Group.js";
import User from "../models/User.js";

export default function socketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Join room (for group chat)
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    // Leave room (for group chat)
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
    });

    // Handle new message
    socket.on("newMessage", async (data) => {
      try {
        const { messageText, roomName, groupId, recipientEmail, senderToken } = data;
        const URL = data?.URL;
        
        const decoded = User.verifyToken(senderToken);
        const senderId = decoded.id;
        const sender = decoded.name;
        let response = {};

        // Handle group chat message
        if (groupId) {
          const group = await Group.findByPk(groupId);
          if (!group) {
            return socket.emit("error", { message: "Group not found" });
          }

          const newMessage = await Message.create({
            message: messageText,
            userId: senderId,
            groupId: groupId,
            fileUrl: URL || null, // Save the URL if provided
          });

          response = {
            id: newMessage.id,
            sender: sender,
            recipient: null,
            message: newMessage.message,
            createdAt: newMessage.createdAt,
            groupId: newMessage.groupId,
            url: newMessage.fileUrl, // Add URL to response
          };
        }
        // Handle private messages
        else if (recipientEmail) {
          const recipient = await User.findOne({
            where: { email: recipientEmail },
          });
          if (!recipient) {
            return socket.emit("error", { message: "Recipient not found" });
          }

          const newMessage = await Message.create({
            message: messageText,
            userId: senderId,
            recipientId: recipient.id,
            fileUrl: URL || null, // Save the URL if provided
          });

          response = {
            id: newMessage.id,
            sender: sender,
            recipient: recipient.name,
            message: newMessage.message,
            createdAt: newMessage.createdAt,
            groupId: null,
            url: newMessage.fileUrl, // Add URL to response
          };
        }

        console.table(response);
        return io.to(roomName).emit("newMessage", response); // Send message to recipient
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("error", {
          message: "An error occurred while sending the message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
