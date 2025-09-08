const express = require('express');
const router = express.Router();
const multer = require('multer');
 const groupController = require('../controllers/group');
router.get('/', groupController.getAllGroups);
router.get('/create', (req, res) => {
  console.log('Rendering create group page');
  res.render('createGroup');
});
router.post('/create', groupController.createGroup);
router.get('/:id', groupController.getGroupPage);

module.exports = router;