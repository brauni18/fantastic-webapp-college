const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/post');
const groupService = require('../services/group');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
router.get('/create', async(req, res) => {
  const communities = await groupService.getAllGroups();
  res.render('createPost',{ communities: communities });
});

router.route('/')
.get(postController.getAllPosts) // get posts
.post( upload.fields([
  { name: 'image-file', maxCount: 3 },
  { name: 'video-file', maxCount: 3 }
]),

postController.createPost);
router.get('/community/:id', postController.getPostsByCommunity);
router.get('/community/name/:name', postController.getPostsByCommunityName);
router.post('/:id/like',postController.toggleLike);
router.post('/:id/comments', postController.addComment);
router.get('/:id/comments', postController.getCommentsByPostId);



module.exports = router;
