const Group = require('../models/groups');

// Create a new group
exports.createGroup = async (name, description, userId) => {
  const group = new Group({
    name,
    description,
    createdBy: userId,
    members: [userId]
  });

  return await group.save();
};

// Get all groups
exports.getAllGroups = async () => {
  return await Group.find().populate('createdBy', 'username');
};

// Get group by ID
exports.getGroupById = async (id) => {
  return await Group.findById(id).populate('members', 'username');
};

// Join a group
exports.joinGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (group.members.includes(userId)) {
    throw new Error('Already a member');
  }

  group.members.push(userId);
  return await group.save();
};

// Leave a group
exports.leaveGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  group.members = group.members.filter(
    memberId => memberId.toString() !== userId.toString()
  );

  return await group.save();
};

// Delete a group
exports.deleteGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (group.createdBy.toString() !== userId.toString()) {
    throw new Error('Unauthorized');
  }

  return await group.remove();
};

// Update group
exports.updateGroup = async (groupId, userId, updateData) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (group.createdBy.toString() !== userId.toString()) {
    throw new Error('Unauthorized');
  }

  group.name = updateData.name || group.name;
  group.description = updateData.description || group.description;

  return await group.save();
};
