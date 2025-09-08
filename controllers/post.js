const postService = require('../services/post');

// Validation functions - these return error messages or null
const checkTitle = (title) => {
    if (!title || title.trim() === '') {
        return 'Title is required';
    }
    if (title.length > 100) {
        return 'Title exceeds maximum length of 100 characters';
    }
    return null;
};
// const checkCommunity = (community) => {
//     // community is optional, no error if not provided
//     //future: add logic to check if community exists in DB and if user is a member
//     }
const checkContent = (content) => {
    if (!content || content.trim() === '') {
        return 'Content is required';
    }
    if (content.length > 500) {
        return 'Content exceeds maximum length of 500 characters';
    }
    return null;
};

const checkImage = (imageFile) => {
    if (!imageFile) {
        return 'Image file is required';
    }
    if (!imageFile.filename) {
        return 'Invalid image file';
    }
    // Check file size (e.g., max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
        return 'Image file too large (max 5MB)';
    }
    // Check file type
    return null;
};

const checkVideo = (videoFile) => {
    if (!videoFile) {
        return 'Video file is required';
    }
    if (!videoFile.filename) {
        return 'Invalid video file';
    }
    // Check file size (e.g., max 50MB)
    if (videoFile.size > 50 * 1024 * 1024) {
        return 'Video file too large (max 50MB)';
    }
    // Check file type
    return null;
};

// Main validation function - takes req and returns validation results
const validatePostData = (req) => {
    const errors = [];
    const { type, title } = req.body;
    
    // Always validate title (common for all post types)
    const titleError = checkTitle(title);
    if (titleError) {
        errors.push(titleError);
    }
    
    // Type-specific validation
    if (type === 'text') {
        const { content } = req.body;
        const contentError = checkContent(content);
        if (contentError) {
            errors.push(contentError);
        }
        
    } else if (type === 'image') {
        const imageFile = req.files && req.files['image-file'] ? req.files['image-file'][0] : null;
        const imageError = checkImage(imageFile);
        if (imageError) {
            errors.push(imageError);
        }
        
    } else if (type === 'video') {
        const videoFile = req.files && req.files['video-file'] ? req.files['video-file'][0] : null;
        const videoError = checkVideo(videoFile);
        if (videoError) {
            errors.push(videoError);
        }  
    } 
    if (errors.length > 0) {
        return errors;

    }else{
        return true;
    }
   
};

// Create a new post (can be with or without a group)
const createPost = async (req, res) => {
    try {
        console.log('📝 controller - Creating post - Request body:', req.body);
        console.log('📁 controller - Request files:', req.files);
        
        // Step 1: Validate the data
        const validation = validatePostData(req);
        
        // Step 2: If validation fails, return errors
        if (validation !== true) {
            console.log('❌ controller - Validation errors:', validation.errors);
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation
           });
        }
        // Step 3: Extract validated data
        const { createdBy, type, title, content, community } = req.body;
        // Step 4: Create post based on type
        let postData = {
            type,
            title,
            community: community || null,
            createdBy,
        };
        
       if (type === 'text') {
        postData.content = content;
        } else if (type === 'image') {
            const imageFile = req.files && req.files['image-file'] ? req.files['image-file'][0] : null;
            postData.imageUrl = imageFile ? `/uploads/${imageFile.filename}` : null;
        } else if (type === 'video') {
            const videoFile = req.files && req.files['video-file'] ? req.files['video-file'][0] : null;
            postData.videoUrl = videoFile ? `/uploads/${videoFile.filename}` : null;
        }
        console.log('🚦 Post data being sent to service:', postData);

        const newpost = await postService.createPost(
            postData.type,
            postData.title, 
            postData.createdBy, 
            postData.community,
            postData.content || '', 
            postData.imageUrl || '',
            postData.videoUrl || ''
        );
        console.log('✅ controller - Post created successfully:', newpost);
        res.status(201).json(newpost);
        
    } catch (err) {
        console.error('❌ controller - Error in createPost:', err);
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
};
const getAllPosts = async (req, res) => {
    const posts = await postService.getAllPosts();
    res.json(posts);
};

const toggleLike = async (req, res) => {
    try{
        
        const { postId, userId } = req.body;
        
        console.log('controller - Toggle like - User ID from body:', userId);
       if(!userId){
        return res.status(401).json({ error: 'User ID is required' });
       }
       const updatedPost = await postService.togglelike(postId, userId);
       res.json(updatedPost);
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};   
const addComment = async (req, res) => {
    try {
        const { postId, comment, username } = req.body;

        if (!username) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
         if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: 'Comment cannot be empty.' });
        }
        if (comment.length > 300) {
            return res.status(400).json({ message: 'Comment exceeds maximum length of 300 characters.' });
        }
        const newComment = await postService.addComment(postId, username, comment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await postService.getCommentsByPostId(postId);
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostsByCommunity = async (req, res) => {
    try {
        const communityId = req.params.id;
        const posts = await postService.getPostsByCommunity(communityId);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts by community:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getPostsByCommunityName = async (req, res) => {
    try {
        // Decode the name from the URL parameter
        const communityName = decodeURIComponent(req.params.name);
        const posts = await postService.getPostsByCommunityName(communityName);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts by community name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await postService.deletePost(id);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        // ✅ Make sure to send JSON response
        res.json({ message: 'Post deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const updatePost = async (req, res) => {
    try {
        console.log('Update request received:', req.params, req.body);
        
        const { id } = req.params;
        const { title, content } = req.body;
        
        // Simple validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        
        const updatedPost = await postService.updatePost(id, { 
            title: title.trim(), 
            content: content.trim() 
        });
        
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        console.log('Post updated successfully:', updatedPost);
        res.json(updatedPost);
        
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    toggleLike,
    addComment,
    getPostsByCommunityName,
    getPostsByCommunity,
    getCommentsByPostId,
    deletePost,
    updatePost
};