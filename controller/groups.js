const groupService = require('../services/groupService');

// Create a new group
const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await groupService.createGroup(name, description, req.user._id);
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all groups
const getAllGroups = async (req, res) => {
  try {
    const groups = await groupService.getAllGroups();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get group by ID
const getGroupById = async (req, res) => {
  try {
    const group = await groupService.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Join a group
const joinGroup = async (req, res) => {
  try {
    const result = await groupService.joinGroup(req.params.id, req.user._id);
    res.json({ message: 'Joined group', group: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Leave a group
const leaveGroup = async (req, res) => {
  try {
    const result = await groupService.leaveGroup(req.params.id, req.user._id);
    res.json({ message: 'Left group', group: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a group
const deleteGroup = async (req, res) => {
  try {
    await groupService.deleteGroup(req.params.id, req.user._id);
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

// Update group details
const updateGroup = async (req, res) => {
  try {
    const group = await groupService.updateGroup(req.params.id, req.user._id, req.body);
    res.json(group);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  deleteGroup,
  updateGroup
};

