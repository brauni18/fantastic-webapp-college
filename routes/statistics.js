const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/users');

// GET /api/statistics/posts-per-day
router.get('/posts-per-day', async (req, res) => {
  console.log('📊 Statistics API - Posts per day endpoint called');
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const posts = await Post.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%m/%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    const postsPerDay = posts.map(p => ({ date: p._id, count: p.count }));
    res.json({ postsPerDay });
  } catch (error) {
    console.error('Posts per day error:', error);
    res.status(500).json({ error: 'Failed to fetch posts data' });
  }
});

// GET /api/statistics/users-online-per-day
router.get('/users-online-per-day', async (req, res) => {
  console.log('📊 Statistics API - Users online per day endpoint called');
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // This tracks users who created accounts per day as a proxy for "online activity"
    // You can modify this to track actual login activity if you have that data
    const users = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%m/%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    const usersOnlinePerDay = users.map(u => ({ date: u._id, count: u.count }));
    res.json({ usersOnlinePerDay });
  } catch (error) {
    console.error('Users online per day error:', error);
    res.status(500).json({ error: 'Failed to fetch users online data' });
  }
});

module.exports = router;
