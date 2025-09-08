const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');
const userService = require('../services/users');

router.get('/register', userController.registerForm);
router.post('/register', userController.createUser);

router.get('/login', userController.loginForm);
router.post('/login', userController.loginUser);

router.get('/home', userController.logout);

router.get('/', userController.isLoggedIn, userController.foo);

router.get('/profile', userController.isLoggedIn, userController.profile);
router.post('/update-profile', userController.isLoggedIn, userController.updateUser);

router.post('/users/delete', userController.deleteUser);

router.get('/checkForGetUserAndGetUsers', async (req, res) => {
    try {
        // Use query username or fallback to logged-in user's username
        const username = req.query.username || (req.session.user && req.session.user.username);
        let user = null;
        if (username) {
            user = await userService.getUser(username);
        }
        const users = await userService.getAllUsers();
    res.render('checkForGetUserAndGetUsers', { user, users, currentUser: req.session.user });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
    

module.exports = router;
