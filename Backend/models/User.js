import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const SALT = process.env.SALT;
        const salt = await bcrypt.genSalt(parseInt(SALT));
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const SALT = process.env.SALT;
          const salt = await bcrypt.genSalt(parseInt(SALT));
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Add an instance method to compare passwords
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Add a class-level method to generate JWT
User.generateToken = function (user) {
  return jwt.sign(
    { id: user.id, name: user.name }, // Updated to use `name` instead of `username`
    process.env.JWT_SECRET,
    // { expiresIn: "24h" } // Uncomment if you want the token to expire in 24 hours
  );
};

// Add a class-level method to verify JWT
User.verifyToken = function (token) {
  try {
    const value = jwt.verify(token, process.env.JWT_SECRET);
    return value;
  } catch (error) {
    return null; // Handle token verification failure
  }
};

export default User;
