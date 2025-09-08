const User = require('../models/users');
const bcrypt = require('bcrypt');

const createUser = async ({username, email, password, firstName, lastName, bio, profilePic}) => {
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
        bio,
        profilePic: profilePic || ''
    });
    await newUser.save();
    return { message: 'User created successfully' };
};



const loginUser = async ({ username, email, password }) => {
    if (!password || (!username && !email)) {
        return null;
    }
    // Find user by either username or email
    const user = await User.findOne({ $or: [
        username ? { username } : {},
        email ? { email } : {}
    ] });
    if (user && await bcrypt.compare(password, user.password)) {
        return user;
    }
    return null;
};


const updateUser = async ({ username, newUsername, email, firstName, lastName, bio, password }) => {
    const user = await User.findOne({ username }); // Find by current username
    if (!user) {
        throw new Error('User not found');
    }
    if (newUsername) user.username = newUsername;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
    }
    if (arguments[0].profilePic) {
        user.profilePic = arguments[0].profilePic;
    }
    await user.save();
    return { message: 'User updated successfully' };
};

const deleteUser = async (username) => {
    if (!username) {
        throw new Error('Username is required');
    }
    const deletedUser = await User.findOneAndDelete({ username });
    if (!deletedUser) {
        throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
};

const getUser = async (username) => {
    if (!username) {
        throw new Error('Username is required');
    }
    const user = await User.findOne({ username }).select('-password');  //exclude password from returned user
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

const getAllUsers = async () => {
    const users = await User.find({}).select('-password');
    return users;
};

const savePinLocation = async (userId, latitude, longitude) => {
    return await User.findByIdAndUpdate(
        userId, 
        { 
            pishpunLatitude: latitude, 
            pishpunLongitude: longitude 
        }, 
        { new: true }
    );
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    savePinLocation
};