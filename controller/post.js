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
        const { type, title, content, createdBy, community } = req.body;

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

module.exports = {
    createPost,
    getAllPosts
};
