const userService = require('../services/users');

function isLoggedIn(req, res, next) {
    if (req.session.user && req.session.user.username != 'Guest') {
        return next();
    }
    res.redirect('/login');
}

function foo(req, res) {
    res.render("index", { username: req.session.username });
}

function loginForm(req, res) {
    res.render("login", {});
}

function registerForm(req, res) {
    res.render("register", {});
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

function profile(req, res) {
    res.render("profile", { user: req.session.user });
}

const createUser = async (req, res) => {
    try {
        let profilePicPath = '';
        if (req.file) {
            profilePicPath = '/uploads/' + req.file.filename;
        }
        await userService.createUser({
            ...req.body,
            profilePic: profilePicPath
        });
        res.redirect('/login'); // Redirect to login page after successful registration
    } catch (error) {
        const msg = error.message || 'Internal server error';
        res.render('register', { error: msg, success: null });
    }
};


const loginUser = async (req, res) => {
    const { identifier, password } = req.body; // identifier can be username or email
        // Pass identifier as both username and email to service
        const user = await userService.loginUser({ username: identifier, email: identifier, password });
        if (user) {
            req.session.user = user; // Save to session after authentication
            res.redirect('/feed');
         } 
         else {
            res.redirect('/login?error=username+or+password+is+incorrect');
        }    
};


const updateUser = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        let profilePicPath = req.session.user.profilePic || '';
        if (req.file) {
            profilePicPath = '/uploads/' + req.file.filename;
        }
        await userService.updateUser({
            ...req.body,
            username: req.session.user.username,
            newUsername: req.body.username,
            profilePic: profilePicPath
        });
        const updatedUser = await userService.getUser(req.session.user.username);
        req.session.user = updatedUser;
        res.redirect('/feed'); // Redirect to homepage after successful update
    } catch (error) {
        const msg = error.message || 'Internal server error';
        res.render('profile', { error: msg, username: req.session.username });
    }
};


const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.session.user.username);
        res.redirect('/login?success=User+has+been+deleted'); // Redirect to login page with success message
    }
    catch (error) {
        const msg = error.message || 'Internal server error';
        res.render('profile', { error: msg, username: req.session.username });
    }
};


const getUser = async (req, res) => {
    try {
        const user = await userService.getUser(req.params.username);
        res.render('/checkForGetUserAndGetUsers', { user }); // or res.json(user)
    } catch (error) {
        res.status(404).send(error.message);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('/checkForGetUserAndGetUsers', { users }); // or res.json(users) for API
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const savePinLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const userId = req.session.user._id;
        await userService.savePinLocation(userId, latitude, longitude);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    loginUser,
    isLoggedIn,
    savePinLocation,
    loginForm,
    foo,
    registerForm,
    logout,
    profile,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers
};