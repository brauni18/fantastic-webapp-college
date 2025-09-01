const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controller/post');
// const Post = require('../models/post');

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

router.get('/', postController.renderHomePage);
// For image or video upload
router.post( '/',upload.fields([
    { name: 'image', maxCount: 4},
    { name: 'video', maxCount: 4 }
  ]),
  postController.createPost
);

router.route('/')
  // .get(postController.getAllPosts)
  .post(postController.createPost);

// router.get('/group/:groupId', postController.getPostsByGroup);

// router.get('/my-posts', postController.getPostsByUser);

// router.delete('/:id', postController.deletePost);


module.exports = router;
