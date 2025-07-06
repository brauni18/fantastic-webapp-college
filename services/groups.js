const Group = require('../models/groups');

// Create a new group
exports.createGroup = async (name, description, userId) => {
  const group = new Group({
    name,
    description,
    createdBy: userId,
    members: [userId] // The creator is automatically added as a member
  });

  return await group.save();
};

// Get all groups from the database
exports.getAllGroups = async () => {
  return await Group.find().populate('createdBy', 'username');
};

// Get a specific group by its ID
exports.getGroupById = async (id) => {
  return await Group.findById(id).populate('members', 'username');
};

// Add a user to a group's members list
exports.joinGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (group.members.includes(userId)) {
    throw new Error('User is already a member');
  }

  group.members.push(userId);
  return await group.save();
};

// Remove a user from a group's members list
exports.leaveGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  group.members = group.members.filter(
    memberId => memberId.toString() !== userId.toString()
  );

  return await group.save();
};

// Delete a group (only allowed if the user is the creator)
exports.deleteGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (group.createdBy.toString() !== userId.toString()) {
    throw new Error('Unauthorized – only the creator can delete the group');
  }

  return await group.remove();
};

// Update group details (only allowed if the user is the creator)
exports.updateGroup = async (groupId, userId, updateData) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (group.createdBy.toString() !== userId.toString()) {
    throw new Error('Unauthorized – only the creator can update the group');
  }

  group.name = updateData.name || group.name;
  group.description = updateData.description || group.description;

  return await group.save();
};
