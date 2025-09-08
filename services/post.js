const PostModel = require('../models/post');
// const Group = require('../models/groups');


// Create a new post
const createPost = async (type,title, createdBy, community, content,imageUrl,videoUrl) => {
    try {
        console.log(' in service Creating post with:', title, createdBy, community,content,imageUrl,videoUrl);

        // Explicitly set the current date/time
        const now = new Date();
        console.log('Current timestamp:', now);
        
        const newPost = new PostModel({
            type: type,
            title: title,
            content: content || '',
            imageUrl: imageUrl || '',
            videoUrl: videoUrl || '',
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
        const posts = await PostModel.find({});
       return posts;
    } catch (error) {
        console.error('service - Error getting all posts:', error);
        throw new Error('service - Failed to get all posts: ' + error.message);
    }
};
const togglelike = async (postId, userId) => {
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
       if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        const hasLiked = post.likes.includes(userId);
        if (hasLiked) {
            // User has already liked the post, so remove the like
            post.likes.pull(userId);
        } else {
            // User has not liked the post yet, so add the like
            post.likes.push(userId);
        }
        await post.save();
        return post;
    } catch (error) {
        console.error('service - Error toggling like:', error);
        throw new Error('service - Failed to toggle like: ' + error.message);
    }
};
const addComment = async (postId, username, comment) => {
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!Array.isArray(post.comments)) {
            post.comments = [];
        }   
        const newComment = { username: username, comment: comment };
        post.comments.push(newComment);
        await post.save();
        await post.populate('comments.username', 'username');
        return post;
    } catch (error) {
        console.error('service - Error adding comment:', error);
        throw new Error('service - Failed to add comment: ' + error.message);
    }
};
const getPostsByCommunity = async (communityid) => {
    const query = communityid === 'everyone' ? {} : { community: communityid };
    return await PostModel.find(query).sort({ createdAt: -1 });
};
const getPostsByCommunityName = async (communityName) => {
    console.log(`📝 service - Getting posts for community by name: ${communityName}`);
    
    return await PostModel.find({ community: communityName }).sort({ createdAt: -1 });
};
const getCommentsByPostId = async (postId) => {
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        return post.comments || [];
    } catch (error) {
        console.error('service - Error getting comments:', error);
        throw new Error('service - Failed to get comments: ' + error.message);
    }
};
module.exports = {
    createPost,
    getAllPosts,
    togglelike,
    addComment,
    getCommentsByPostId,
    getPostsByCommunityName,
    getPostsByCommunity
};