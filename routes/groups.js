const express = require('express');
const router = express.Router();

const groupController = require('../controller/groups');

router.route('/')
.get(groupController.getAllGroups);

router.route('/create', require, groupController.createGroup);



router.get('/:id', groupController.getGroupById);


router.post('/:id/join', require, groupController.joinGroup);


router.post('/:id/leave', require, groupController.leaveGroup);


router.delete('/:id', require, groupController.deleteGroup);


router.put('/:id', require, groupController.updateGroup);

module.exports = router;
