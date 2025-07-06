const express = require('express');
const router = express.Router();

const groupController = require('../controller/groupsController');
const requireAuth = require('../middleware/requireAuth'); // Middleware to protect routes (if you have authentication)

// GET all groups (public endpoint)
router.get('/', groupController.getAllGroups);

// GET a specific group by ID
router.get('/:id', groupController.getGroupById);

// POST a new group (only for authenticated users)
router.post('/', requireAuth, groupController.createGroup);

// POST: Join a group (authenticated user only)
router.post('/:id/join', requireAuth, groupController.joinGroup);

// POST: Leave a group
router.post('/:id/leave', requireAuth, groupController.leaveGroup);

// PUT: Update group details (only by the group creator)
router.put('/:id', requireAuth, groupController.updateGroup);

// DELETE: Remove a group (only by the group creator)
router.delete('/:id', requireAuth, groupController.deleteGroup);

// Export the router so it can be used in app.js
module.exports = router;
