const PostModel = require('../models/post');
// const Group = require('../models/groups');


// Create a new post
const createPost = async (type,title, content, createdBy, community) => {
    try {
        console.log(' in service Creating post with:', title, content, createdBy, community);

        // Explicitly set the current date/time
        const now = new Date();
        console.log('Current timestamp:', now);
        
        const newPost = new PostModel({
            type: type,
            title: title,
            content: content,
            createdBy: createdBy,
            community: community,
            createdAt: now
        });
        const savedPost = await newPost.save();
        return savedPost;

    } catch (error) { 
        console.error('service - Error creating post:', error);
        throw new Error('service - Failed to create post: ' + error.message);
    }
};
const getAllPosts = async () => {
    try{
        return await PostModel.find({});
    } catch (error) {
        console.error('service - Error getting all posts:', error);
        throw new Error('service - Failed to get all posts: ' + error.message);
    }
};
// Update a post by ID
// const updatePost = async (postId, content, userId) => {
//     try {
//         const post = await Post.findById(postId);
//         if (!post) throw new Error('Post not found');
//         if (post.createdBy.toString() !== userId.toString()) {
//             throw new Error('Unauthorized');
//         }
//         post.content = content;
//         await post.save();
//         return post;
//     } catch (error) {
//         console.error('Error updating post:', error);
//         throw error;
//     }
// };

// // Get a single post by ID
// const getPost = async (postId) => {
//     try {
//         const post = await Post.findById(postId)
//             .populate('createdBy', 'username')
//             .populate('group', 'name');
//         if (!post) throw new Error('Post not found');
//         return post;
//     } catch (error) {
//         console.error('Error getting post:', error);
//         throw error;
//     }
// };

// // Get all posts
// const getAllPosts = async () => {
//     try {
//         const posts = await Post.find()
//             .populate('createdBy', 'username')
//             .populate('group', 'name')
//             .sort({ createdAt: -1 });
//         return posts;
//     } catch (error) {
//         console.error('Error getting all posts:', error);
//         throw error;
//     }
// };

// // Get posts by group ID
// const getPostsByGroup = async (groupId) => {
//     try {
//         const posts = await Post.find({ group: groupId })
//             .populate('createdBy', 'username')
//             .sort({ createdAt: -1 });
//         return posts;
//     } catch (error) {
//         console.error('Error getting posts by group:', error);
//         throw error;
//     }
// };

// // Get posts by user ID
// const getPostsByUser = async (userId) => {
//     try {
//         const posts = await Post.find({ createdBy: userId })
//             .populate('group', 'name')
//             .sort({ createdAt: -1 });
//         return posts;
//     } catch (error) {
//         console.error('Error getting posts by user:', error);
//         throw error;
//     }
// };

// // Delete a post by ID (only by creator)
// const deletePost = async (postId, userId) => {
//     try {
//         const post = await Post.findById(postId);
//         if (!post) throw new Error('Post not found');
//         if (post.createdBy.toString() !== userId.toString()) {
//             throw new Error('Unauthorized');
//         }
//         await post.remove();
//         return { message: 'Post deleted successfully' };
//     } catch (error) {
//         console.error('Error deleting post:', error);
//         throw error;
//     }
// };

module.exports = {
    createPost,
    getAllPosts,
    
    // updatePost,
    // getPost,
    // getPostsByGroup,
    // getPostsByUser,
    // deletePost
};