const express = require('express');
const router = express.Router();
const usersController = require('../controller/users');
const { createUser,
    deleteUser,
    updateUser,
    updateUserPassword,
    getUser,
    getAllUsers,
    loginUser } = require('../controller/users');

// Route to create a new user
router.post('/', createUser);
// Route to delete a user
router.delete('/:id', deleteUser);
// Route to update user details
router.put('/:id', updateUser);
// Route to get user details (optional, not in original code)
router.get('/:id', getUser);
// Route to get all users (optional, not in original code)
router.get('/', getAllUsers);
// Route to update user password
router.put('/password/:id', updateUserPassword);
// Route to login a user
router.post('/login', loginUser);
router.post('/login', usersController.isLoggedIn);

router.get('/', (req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

router.get('/users', async (req, res) => {
    res.render('createUser');
});

module.exports = router;