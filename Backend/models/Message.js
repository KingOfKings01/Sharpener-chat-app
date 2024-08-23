import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "../models/User.js";

const Message = sequelize.define("Message", {
  id: {                                                     
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // References the User model
      key: "id",   // The id in User model
    },
  },
});

// Setting up the associations
User.hasMany(Message, {
  foreignKey: "userId",
  as: "messages",
});

Message.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Message;
