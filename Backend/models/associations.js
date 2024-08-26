import User from './User.js';
import Group from './Group.js';
import Message from './Message.js';
import GroupMember from './GroupMember.js';

const setupAssociations = () => {
  // User - Message association (One-to-Many)
  User.hasMany(Message, { foreignKey: 'userId' });
  Message.belongsTo(User, { foreignKey: 'userId' });

  // Group - Message association (One-to-Many)
  Group.hasMany(Message, { foreignKey: 'groupId' });
  Message.belongsTo(Group, { foreignKey: 'groupId' });

  // User - GroupMember association (One-to-Many)
  User.hasMany(GroupMember, { foreignKey: 'userId' });
  GroupMember.belongsTo(User, { foreignKey: 'userId' });

  // Group - GroupMember association (One-to-Many)
  Group.hasMany(GroupMember, { foreignKey: 'groupId' });
  GroupMember.belongsTo(Group, { foreignKey: 'groupId' });

  // User - Group association (Many-to-Many through GroupMember)
  User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId', as: 'Groups' });
  Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId', as: 'Members' });
};

export default setupAssociations;
