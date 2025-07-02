const express = require('express');
const router = express.Router();

const postController = require('../controller/post');

router.post('/', requireAuth, postController.createPost);

router.get('/', postController.getAllPosts);

router.get('/group/:groupId', postController.getPostsByGroup);

router.get('/my-posts', requireAuth, postController.getPostsByUser);

router.delete('/:id', requireAuth, postController.deletePost);

module.exports = router;
