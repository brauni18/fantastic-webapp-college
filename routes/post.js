const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controller/post');


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

router.get('/create', (req, res) => {
  res.render('createPost');
});
const logRequest = (req, res, next) => {
    console.log('🚦 === MIDDLEWARE HIT ===');
    console.log('🚦 Method:', req.method);
    console.log('🚦 URL:', req.originalUrl);
    console.log('🚦 Body:', req.body);

    next(); // Pass control to next middleware/controller
};

router.route('/')
.post( upload.fields([
  { name: 'image-file', maxCount: 3 },
  { name: 'video-file', maxCount: 3 }
]),
logRequest,
postController.createPost)
.get(postController.getAllPosts); // get posts


// router.get('/group/:groupId', postController.getPostsByGroup);

// router.get('/my-posts', postController.getPostsByUser);

// router.delete('/:id', postController.deletePost);


module.exports = router;
