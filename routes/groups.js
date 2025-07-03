const express = require('express');
const router = express.Router();

const groupController = require('../controller/groupsController');

router.route('/')
.get(groupController.getAllGroups);

router.route('/create'), requireAuth, groupController.createGroup);



router.get('/:id', groupController.getGroupById);


router.post('/:id/join', requireAuth, groupController.joinGroup);


router.post('/:id/leave', requireAuth, groupController.leaveGroup);


router.delete('/:id', requireAuth, groupController.deleteGroup);


router.put('/:id', requireAuth, groupController.updateGroup);

module.exports = router;
