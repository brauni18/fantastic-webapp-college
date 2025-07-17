const postService = require('../services/post');

// Create a new post (can be with or without a group)
const createPost = async (req, res) => {
    try {
    const { type, title, content } = req.body;
    let image = null, video = null;

    if (req.files && req.files.image) {
      const file = req.files.image[0];
      image = {
        filename: file.filename,
        mimetype: file.mimetype,
        path: file.path
      };
    }
    if (req.files && req.files.video) {
      const file = req.files.video[0];
      video = {
        filename: file.filename,
        mimetype: file.mimetype,
        path: file.path
      };
    }

    const post = await Post.create({
      type,
      title,
      content,
      image,
      video,
      createdBy: req.user._id
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts (including posts without a group)
const getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get posts by group ID
const getPostsByGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const posts = await postService.getPostsByGroup(groupId);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all posts created by the current user
const getPostsByUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not logged in" });
        }
        const posts = await postService.getPostsByUser(req.user._id);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a post (only by the creator)
const deletePost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not logged in" });
        }
        const { postId } = req.params;
        const result = await postService.deletePost(postId, req.user._id);
        res.json(result);
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
