const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        maxlength: 200,
        trim: true
    },
    createdBy: {
        type: String,
        required: true
    },
    members: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Group', groupSchema);