const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/users');
router.get('/posts-per-day', async (req, res) => {
  console.log('running statistics a');
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
    console.error('error post:', error);
    res.status(500).json({ error: 'Fail post' });
  }
});

router.get('/users-online-per-day', async (req, res) => {
  console.log('running statistics b');
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
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
    console.error('Error', error);
    res.status(500).json({ error: 'Fail' });
  }
});

module.exports = router;
