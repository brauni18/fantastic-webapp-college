const Group = require('../models/groups');
const mongoose = require('mongoose');

// add new group
const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = new Group({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// see all the group 
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('createdBy', 'username');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'username');
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// add user to a new group
const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    group.members.push(req.user._id);
    await group.save();

    res.json({ message: 'Joined group successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// leave a group(all users can leave)
const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members = group.members.filter(
      memberId => memberId.toString() !== req.user._id.toString()
    );

    await group.save();
    res.json({ message: 'Left group successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// delete a group (only the creator can delete)
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized: Only the creator can delete the group' });
    }

    await group.remove();
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update a group (only the creator can update)
const updateGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized: Only the creator can update the group' });
    }

    group.name = name || group.name;
    group.description = description || group.description;

    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

