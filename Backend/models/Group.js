import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import GroupMember from './GroupMember.js';

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});


export default Group;
