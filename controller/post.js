const Post = require('../models/post');
const Group = require('../models/groups');

// Create a new post (can be with or without a group)
const createPost = async (req, res) => {
  try {
    const { content, groupId } = req.body;

    let group = null;
    if (groupId) {
      group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found' });
    }

    const post = new Post({
      content,
      group: groupId || null,
      createdBy: req.user._id
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all posts (including posts without a group)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('createdBy', 'username')
      .populate('group', 'name')
      .sort({ createdAt: -1 }); // Newest first

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get posts by group ID
const getPostsByGroup = async (req, res) => {
  try {
    const posts = await Post.find({ group: req.params.groupId })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts created by the current user
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user._id })
      .populate('group', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post (only by the creator)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByGroup,
  getPostsByUser,
  deletePost
};
