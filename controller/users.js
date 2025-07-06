const userService = require('../services/users');

const createUser = async (req, res) => {
    try{
        const userData = req.body;
        const result = await User.create(userData);
        res.status(201).json(result);
    } catch (error) {
        const msg = error.message || 'Internal server error';
        
        const status = msg === 'All fields are required' || msg === 'Username already exists'
      ? 400 : 500;
        console.error('Error creating user:', error);
        res.status(status).json({ message: msg });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await userService.deleteUser(userId);
        res.status(200).json(result);
    } catch (error) {
        const msg = error.message || 'Internal server error';
        const status = msg === 'User ID is required' || msg === 'User not found'
            ? 400 : 500;
        console.error('Error deleting user:', error);
        res.status(status).json({ message: msg });
    }
};

const updateUser = async (req, res) => {
    try { 
        const result = await userService.updateUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        const msg = error.message || 'Internal server error';
        const status = msg === 'All fields are required' || msg === 'User not found'
            ? 400 : 500;
            console.error('Error updating user:', error);
        res.status(status).json({ message: msg });
    }
};
        
const updateUserPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        if (!userId || !newPassword) {
            return res.status(400).json({ message: 'User ID and new password are required' });
        }
        const result = await userService.updateUserPassword(userId, newPassword);
        res.status(200).json(result);
    } catch (error) {
        const msg = error.message || 'Internal server error';
        const status = msg === 'User not found' || msg === 'User ID and new password are required'
            ? 400 : 500;
        console.error('Error updating user password:', error);
        res.status(status).json({ message: msg });
    }
};
const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        const msg = error.message || 'Internal server error';
        const status = msg === 'User not found' || msg === 'User ID is required'
            ? 400 : 500;
        console.error('Error fetching user:', error);
        res.status(status).json({ message: msg });
    }
};

    
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {userService, createUser, deleteUser, updateUser,updateUserPassword, getUser, getAllUsers};

