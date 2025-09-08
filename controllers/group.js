const groupService = require('../services/group');
const postService = require('../services/post');
// Validation functions
const checkGroupName = (name) => {
    if (!name || name.trim() === '') {
        return 'Group name is required';
    }
    if (name.length > 50) {
        return 'Group name exceeds maximum length of 50 characters';
    }
    return null;
};

const checkDescription = (description) => {
    if (description && description.length > 200) {
        return 'Description exceeds maximum length of 200 characters';
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
        console.log('📝 controller - Creating group - Request body:', req.body);
        
        // Step 1: Validate the data
        const validation = validateGroupData(req);
        
        // Step 2: If validation fails, return errors
        if (validation !== true) {
            console.log('❌ controller - Validation errors:', validation);
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation
            });
        }
        
        // Step 3: Extract validated data
        const { name, description, createdBy } = req.body;
        const newGroup = await groupService.createGroup(name, description, createdBy);
        
        console.log('✅ controller - Group created successfully:', newGroup);
        res.status(201).json({
            success: true,
            group: newGroup,
            message: 'Group created successfully!'
        });
        
    } catch (err) {
        console.error('❌ controller - Error in createGroup:', err);
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
};
const getAllGroups = async (req, res) => {
    try {
        console.log('📝 controller - Fetching all groups');
        const groups = await groupService.getAllGroups();
        res.status(200).json({
            success: true,
            groups
        });
    } catch (err) {
        console.error('❌ controller - Error in getAllGroups:', err);
        return res.status(500).json({
            error: 'Internal server error',
            details: err.message
        });
    }
};
const getGroupPage = async (req, res) => {
    try {
        const groupId = req.params.id;
        const group = await groupService.getGroupById(groupId);

        if (!group) {
            return res.status(404).render('404'); // Or a custom 'group not found' page
        }

        const posts = await postService.getPostsByCommunity(groupId);

        res.render('groupPage', { 
            group: group, 
            posts: posts,
            user: req.user // Pass user for navbar/sidebar logic
        });

    } catch (err) {
        console.error('❌ controller - Error in getGroupPage:', err);
        return res.status(500).json({
            error: 'Internal server error',
            details: err.message
        });
    }
};

module.exports = {
    createGroup,
    getAllGroups,
    getGroupPage
};
