API_BASE_URL = '/posts';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async function() {
   await getPosts();

  // Add event listener for the create post button
 const createPostBtn = document.getElementById('create-post-btn');
 const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  
  sidebar.addEventListener('mouseenter', function() {
            mainContent.style.marginLeft = '250px';
        });
  sidebar.addEventListener('mouseleave', function() {
            mainContent.style.marginLeft = '70px';
        });
  createPostBtn.addEventListener('click',async function(e) {
    e.preventDefault();
   window.location.href = '/posts/create';

  });
  
  // Add form submission handler
  const createPostFrom = document.getElementById('createPostForm');
  if (createPostFrom) {
    createPostFrom.addEventListener('submit', handlePostSubmit);
  }
  document.querySelectorAll('.home-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if(document.getElementById('post-list')){
        
        e.preventDefault(); // Prevent default navigation
        getPosts(); // Fetch and display posts dynamically
        history.pushState(null, '', '/'); // Update URL without reloading
        
      }
    });
  });
});

const getPosts = async () => {
  const postList = document.getElementById('post-list');
  if(!postList){
    window.location.href = '/';
  }
  try {
    const response = await fetch(API_BASE_URL);
    const posts = await response.json();

    const postList = document.getElementById('post-list');
    postList.innerHTML = ''; 
    if (posts.length > 0) {
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postList.appendChild(postElement);
        });
    } else {
      postList.innerHTML = `
            <div class="card text-center"><div class="card-body">
                <h5 class="card-title">No Posts Found</h5>
                <p class="card-text">It's quiet in here... maybe you should create a post!</p>
            </div></div>
        `;
    }
    } catch (error) {
  console.error('Fetch error:', error);
  alert('Error fetching posts: ' + error.message);
}

function createPostElement(post) {
    const postitem = document.createElement('li');
    postitem.className = 'card post-card mb-3';
    

    // Safely access nested properties
    const communityName = post.community ? post.community : 'everyone';
    const authorName = post.createdBy ? post.createdBy : 'me_gusta_hacker_776';

    let contentHtml = '';
    if (post.type === 'text' && post.content) {
        contentHtml = `<p class="card-text">${post.content}</p>`;
    } else if (post.type === 'image' && post.imageUrl) {
        contentHtml = `<img src="${post.imageUrl}" class="img-fluid rounded" alt="${post.title}">`;
    } else if (post.type === 'video' && post.videoUrl) {
        contentHtml = `<video controls class="img-fluid rounded"><source src="${post.videoUrl}" type="video/mp4"></video>`;
    }

    postitem.innerHTML = `
        <div id="post-${post._id}" class="card-body">
            <div class="post-header d-flex align-items-center mb-2" style="font-size: 0.85rem;">
                <a href="/c/${communityName}" class="fw-bold me-2 text-decoration-none">${communityName}</a><span class="text-muted">·</span> 
                <span class="text-muted ms-2">${new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                <span class="text-muted ms-2"><a href="/u/${authorName}" class="text-decoration-none">${authorName}</a></span>
                </div>
            <h5 class="card-title">${post.title}</h5>
            <div class="post-content mb-3">${contentHtml}</div>
            <div class="post-footer d-flex align-items-center">
                <div class="vote-buttons d-flex align-items-center border rounded p-1">
                    <button id="like-btn-${post._id}" class="btn btn-sm btn-light vote-btn like-btn"><i class="bi bi-arrow-up"></i></button>
                    <span class="vote-count fw-bold mx-2">${(post.likes || 0) - (post.dislikes || 0)}</span>
                    <button id="dislike-btn-${post._id}" class="btn btn-sm btn-light vote-btn dislike-btn"><i class="bi bi-arrow-down"></i></button>
                </div>
                <a href="/posts/${post._id}/comments" class="btn btn-sm btn-light ms-3">
                    <i class="bi bi-chat-left-text"></i> <span class="ms-1">${post.commentCount || 0} Comments</span>
                </a>
                <a href="/posts/${post._id}/shares" class="btn btn-sm btn-light ms-3">
                    <i class="bi bi-share"></i> <span class="ms-1">${post.shareCount || 0} Shares</span>
                </a>
            </div>
        </div>
    `;

    return postitem;
  }
}

const likeBtn = document.querySelector(`#post-${postId}.like-btn`);

likeBtn.addEventListener('click', async () => {
  await sendLikeRequest(postId);
  await getPosts(); // Refresh posts to update like count
  //if user clicked like the color also change
  likeBtn.classList.add('btn-primary');
});
const sendLikeRequest = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${postId}/likes`, {
      method: 'POST',
     
    });
    if (!response.ok) {
      throw new Error('Failed to like post');
    }
  } catch (error) {
    console.error('Error liking post:', error);
    alert('Error liking post: ' + error.message);
  }
}