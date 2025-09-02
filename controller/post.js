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
        const { type, title, createdBy, community } = req.body;

        // Step 4: Create post based on type
        let post;
        
        if (type === 'text') {
            const { content } = req.body;
            post = await postService.createPost(type,title, content, createdBy, community);
            
        } else if (type === 'image') {

            const imageFile = req.files && req.files['image-file'] ? req.files['image-file'][0] : null;
            const imageData = {
                filename: imageFile.filename,
                originalname: imageFile.originalname,
                mimetype: imageFile.mimetype,
                path: imageFile.path,
                size: imageFile.size
            };
            
            
            post = await postService.createPost(type, title, JSON.stringify(imageData), createdBy, community);

        } else if (type === 'video') {
            const videoFile = req.files && req.files['video-file'] ? req.files['video-file'][0] : null; 
          
            const videoData = {
                filename: videoFile.filename,
                originalname: videoFile.originalname,
                mimetype: videoFile.mimetype,
                path: videoFile.path,
                size: videoFile.size
            };

                post = await postService.createPost(type, title, JSON.stringify(videoData), createdBy, community);
            }
        
        console.log('✅ controller - Post created successfully:', post);
        res.status(201).json(post);
        
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
// Get all posts (including posts without a group)
// const getAllPosts = async (req, res) => {
//     try {
//         const posts = await postService.getAllPosts();
//         res.json(posts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Get posts by group ID
// const getPostsByGroup = async (req, res) => {
//     try {
//         const { groupId } = req.params;
//         const posts = await postService.getPostsByGroup(groupId);
//         res.json(posts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Get all posts created by the current user
// const getPostsByUser = async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ error: "User not logged in" });
//         }
//         const posts = await postService.getPostsByUser(req.user._id);
//         res.json(posts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Delete a post (only by the creator)
// const deletePost = async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ error: "User not logged in" });
//         }
//         const { postId } = req.params;
//         const result = await postService.deletePost(postId, req.user._id);
//         res.json(result);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.renderHomePage = async (req, res) => {
//   const posts = await Post.find().populate('createdBy', 'username').sort({ createdAt: -1 });
//   res.render('home', { posts }); // Renders views/home.ejs
// };

module.exports = {
    createPost,
    getAllPosts,
    // getPostsByGroup,
    // getPostsByUser,
    // deletePost
};
