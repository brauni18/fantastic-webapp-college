const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/users');
const userService = require('../services/users');

// Multer setup for profilePic upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/register', userController.registerForm);
router.post('/register', upload.single('profilePic'), userController.createUser);

router.get('/login', userController.loginForm);
router.post('/login', userController.loginUser);

router.get('/home', userController.logout);

router.get('/', userController.isLoggedIn, userController.foo);

router.get('/profile', userController.isLoggedIn, userController.profile);
router.post('/update-profile', upload.single('profilePic'), userController.isLoggedIn, userController.updateUser);

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

router.post('/api/users/save-pin', userController.isLoggedIn, userController.savePinLocation);
    

module.exports = router;
