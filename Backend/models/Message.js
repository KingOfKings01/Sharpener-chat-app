import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Group from "./Group.js";

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
      model: User,
      key: "id",
    },
  },
  recipientId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
      allowNull: true, // Make this field optional
    },
  },
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: "id",
      allowNull: true, // Make this field optional
    },
  },
});


export default Message;
