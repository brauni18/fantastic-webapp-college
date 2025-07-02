const express = require('express');
const router = express.Router();
const { createUser, deleteUser, updateUser } = require('../controller/users');

// Route to create a new user
router.post('/', createUser);
// Route to delete a user
router.delete('/:id', deleteUser);
// Route to update user details
router.put('/:id', updateUser);