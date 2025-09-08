const groupService = require('../services/group');
const postService = require('../services/post');
// Validation functions
const checkGroupName = (name) => {
    if (!name || name.trim() === '') {
        return 'Group name required';
    }
    if (name.length > 50) {
        return 'Group name exceeds max length (50)';
    }
    return null;
};

const checkDescription = (description) => {
    if (description && description.length > 200) {
        return 'Description exceeds max (200)';
    }
    return null;
};

const validateGroupData = (req) => {
    const errors = [];
    const { name, description } = req.body;
    
    const nameError = checkGroupName(name);
    if (nameError) {
        errors.push(nameError);
    }
    
    const descError = checkDescription(description);
    if (descError) {
        errors.push(descError);
    }
    
    if (errors.length > 0) {
        return errors;
    } else {
        return true;
    }
};
const createGroup = async (req, res) => {
    try {
        console.log('controller creating groups request body', req.body);
        
        const validation = validateGroupData(req);
        if (validation !== true) {
            console.log('controller error validating', validation);
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation
            });
        }
        
        const { name, description, createdBy } = req.body;
        const newGroup = await groupService.createGroup(name, description, createdBy);
        
        console.log('controller group created', newGroup);
        res.status(201).json({
            success: true,
            group: newGroup,
            message: 'Group created success'
        });
        
    } catch (err) {
        console.error('controller error createGroup:', err);
        return res.status(500).json({ 
            error: 'INTERNAL SERVER ERROR', 
            details: err.message 
        });
    }
};
const getAllGroups = async (req, res) => {
    try {
        console.log('controller fetching groups');
        const groups = await groupService.getAllGroups();
        res.status(200).json({
            success: true,
            groups
        });
    } catch (err) {
        console.error('controller error getAllGroups:', err);
        return res.status(500).json({
            error: 'INTERNAL SERVER ERROR',
            details: err.message
        });
    }
};
const getGroupPage = async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await groupService.getGroupById(groupId);

        if (!group) {
            return res.status(404).render('404');
        }

        const posts = await postService.getPostsByCommunity(groupId);

        res.render('groupPage', { 
            group: group, 
            posts: posts,
            user: req.user
        });

    } catch (err) {
        console.error('controller error getGroupPage:', err);
        return res.status(500).json({
            error: 'INTERNAL SERVER ERROR',
            details: err.message
        });
    }
};

module.exports = {
    createGroup,
    getAllGroups,
    getGroupPage
};
