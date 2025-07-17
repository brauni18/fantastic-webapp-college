const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controller/post');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// For image or video upload
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  postController.createPost
);

router.get('/', postController.getAllPosts);

router.get('/group/:groupId', postController.getPostsByGroup);

// router.get('/my-posts', requireAuth, postController.getPostsByUser);

// router.delete('/:id', requireAuth, postController.deletePost);

module.exports = router;
