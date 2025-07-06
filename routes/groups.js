const express = require('express');
const router = express.Router();

const groupController = require('../controller/groupsController');
const requireAuth = require('../middleware/requireAuth'); // Middleware to check if user is logged in

// Route: GET
// Render a view that lists all groups
router.get('/', async (req, res) => {
  try {
    const groups = await groupController.getAllGroupsDirect(); 
    res.render('groups', { groups });
  } catch (err) {
    res.status(500).send('Error loading groups page');
  }
});

// Route: GET
// Show the form to create a new group
router.get('/create', requireAuth, (req, res) => {
  res.render('create-group'); // Render a form page for creating a group
});

// route: POST 
// Handle submission of the create group form
router.post('/create', requireAuth, async (req, res) => {
  try {
    await groupController.createGroup(req, res); // Reuse the controller logic to create the group
    res.redirect('/groups'); // Redirect back to the group list after creation
  } catch (err) {
    res.status(400).send('Could not create group');
  }
});

module.exports = router;
