const User = require('../models/users');
const bcrypt = require('bcryptjs');

exports.createUser = async ({username, email, password, firstName, lastName, bio}) => {
    if(!username || !email || !password || !firstName || !lastName) {
        throw new Error('All fields are required');
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new Error('Username or email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        bio
    });
    await newUser.save();
    return { message: 'User created successfully' };
};

exports.deleteUser = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
};

exports.updateUser = async ({ userId, username, email, firstName, lastName, bio }) => {
    if (!userId || !username || !email || !firstName || !lastName) {
        throw new Error('All fields are required');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.username = username;
    user.email = email;
    // user.password = user.password; // Password should not be updated unless explicitly changed
    user.firstName = firstName;
    user.lastName = lastName;
    user.bio = bio;
    await user.save();
    return { message: 'User updated successfully' };
};

exports.updateUserPassword = async (userId, newPassword) => {
    if (!userId || !newPassword) {
        throw new Error('User ID and new password are required');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { message: 'Password updated successfully' };
}

exports.getUser = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

exports.getAllUsers = async () => {
    const users = await User.find().select('-password');
    return users;
}