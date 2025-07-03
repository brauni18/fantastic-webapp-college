const express = require('express');
var router = express.Router();
const groupController = require('../controllers/api_groups');

router.route('/')
    .get(groupController.getGroups)
    .post(groupController.createGroup);

router.route('/:id')
    .get(groupController.getGroup)
    .patch(groupController.updateGroup)
    .delete(groupController.deleteGroup);

module.exports = router;