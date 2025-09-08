const Group = require('../models/group');

async function createGroup(name, description, createdBy) {
    try {
        const newGroup = new Group({
            name,
            description,
            createdBy
        });
        await newGroup.save();
        return newGroup;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}
const getAllGroups = async () => {
    console.log('service getting groups');
    return await Group.find().sort({ createdAt: -1 });
    
};
const getGroupById = async (groupId) => {
    console.log(`service getting groupID: ${groupId}`);
    return await Group.findById(groupId);
};

module.exports = {
    createGroup,
    getAllGroups,
    getGroupById  
};