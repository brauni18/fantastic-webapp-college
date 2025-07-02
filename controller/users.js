const User = require('../models/users');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, bio } = req.body;
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required' });
        }   
        const existingUser = await users.findOne({ $or:[{email}, {username}]});
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new users({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            bio
        });
        await newUser.save();  
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error)('error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId, username, email, firstName, lastName, bio } = req.body;
        if (!userId || !username || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = username;
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.bio = bio;
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {createUser, deleteUser, updateUser};

