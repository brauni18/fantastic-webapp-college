
GROUPS_API_BASE_URL = '/groups';
document.addEventListener('DOMContentLoaded', async () => {
    const createCommunityBtn = document.getElementById('create-community-btn'); 
     createCommunityBtn.addEventListener('click',async function(e) {
        e.preventDefault();
        console.log("Create Community button clicked");
        window.location.href = '/groups/create';
     });    
     await loadCommunities();
});
const submitBtn = document.getElementById('submit-btn');
if (submitBtn) {

submitBtn.addEventListener('click', async function(e) {
    e.preventDefault();
        const communityNameInput = document.getElementById('community-name').value.trim();
        const communityDescriptionInput = document.getElementById('community-description').value.trim();
        const createdBy = window.currentUsername;

    if (!communityNameInput || !communityDescriptionInput) {
        alert('Please fill in all fields.');
        return;
    }
    try{
        const response = await fetch(`${GROUPS_API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: communityNameInput,
                description: communityDescriptionInput,
                createdBy: createdBy
            }),
            credentials: 'include'
        });
        const newCommunity = await response.json();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Community created successfully:', newCommunity);
        } catch(error){
        console.error('Error creating community:', error);
        alert('An error occurred while creating the community. Please try again.');
        return;
     }
    });
}
const loadCommunities = async () => {
    const communityList = document.getElementById('community-list');
    if (!communityList) return; // Exit if the list element isn't on the page

    try {
        const response = await fetch(GROUPS_API_BASE_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch communities');
        }
        const communities = await response.json();
        const communitiesArray = communities.groups;
        console.log('Fetched communities:', communitiesArray);
        communityList.innerHTML = ''; // Clear loading/stale state

        if (!communities) {
            communityList.innerHTML = '<li class="nav-item"><span class="nav-link text-muted small">No communities yet.</span></li>';
        } else {
            communitiesArray.forEach(community => {
                const communityElement = document.createElement('li');
                communityElement.className = 'nav-item';
                // Note: The link will go to a page you'll create later
                communityElement.innerHTML = `
                    <a class="nav-link" href="/groups/${community._id}">
                        <i class="fas fa-users fa-fw"></i>
                        <span>${community.name}</span>
                    </a>
                `;
                communityList.appendChild(communityElement);
            });
        }
    } catch (error) {
        console.error('Error loading communities:', error);
        communityList.innerHTML = '<li class="nav-item"><span class="nav-link text-danger small">Error loading.</span></li>';
    }
};