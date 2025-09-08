API_BASE_URL = '/posts';

// Initialize when page loads
const getPosts = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Error fetching posts: ' + error.message);
  }
};
const getPostsByGroupName = async (groupName) => {
    try {
        // Note the new URL structure
        const response = await fetch(`${API_BASE_URL}/community/${groupName}`);
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
      console.error(`Error fetching posts for group ${groupName}:`, error);
    }
  };
  
  function renderPosts(posts) {
    const postList = document.getElementById('post-list');
    if (!postList) return;
    postList.innerHTML = '';
    
    if (posts.length > 0) {
      const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      sortedPosts.forEach(post => {
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
};

const createPostElement = (post) => {
    const postitem = document.createElement('li');
    postitem.className = 'card post-card mb-3';
    
    const currentUserId = window.currentUsername; 
    const hasLiked = post.likes.includes(currentUserId);
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
    <span class="text-muted ms-2">${authorName}</span>
    </div>
            <h5 class="card-title">${post.title}</h5>
            <div class="post-content mb-3">${contentHtml}</div>
            <div class="post-footer d-flex align-items-center">
                <div class="vote-buttons d-flex align-items-center border rounded p-1">
                <button class="btn btn-sm btn-light vote-btn like-btn ${hasLiked ? 'active' : ''}">
                <i class="bi bi-arrow-up"></i>
                </button>
                <span class="vote-count fw-bold mx-2">${post.likes.length}</span>
                </div>
                <button  id="comments-btn" class="btn btn-sm btn-light ms-3 comments-btn">
                    <i class="bi bi-chat-left-text"></i> <span class="ms-1 comment-count">${post.comments.length} Comments</span>
                </button>
                <button id="share-btn" class="btn btn-sm btn-light ms-3 share-btn">
                    <i class="bi bi-share"></i> <span class="ms-1">${post.shareCount || 0} Shares</span>
                </button>
            </div>
            <div id="comments-section-${post._id}" class="comments-section mt-3" style="display: none;">
              <ul class="list-unstyled comment-list-${post._id} mb-2">
                <!-- Comments will be dynamically loaded here -->

              </ul>
              <textarea id="comment-input-${post._id}" class="form-control mb-2 comment-input" placeholder="dont comment.." rows="2"></textarea>
              <button id="comment-btn-${post._id}" class="btn comment-control btn-sm">Comment</button>
              <button class="btn comment-control btn-sm ms-2">Cancel</button>
              </div>
              </div>
              `;
    const likeBtn = postitem.querySelector('.like-btn');
    likeBtn.addEventListener('click', async () => {
      console.log('Like button clicked for post:', post._id);
      toggleLike(post._id, likeBtn);
    });

    const commentsBtn = postitem.querySelector('.comments-btn');
    commentsBtn.addEventListener('click', async () => {
      console.log('Comment button clicked for post:', post._id);
      const commentsSection = document.getElementById(`comments-section-${post._id}`);
      if (commentsSection.style.display === 'block') {
        commentsSection.style.display = 'none';
      } else {
        commentsSection.style.display = 'block';
        //load comments
        getCommentsByPostId(post._id);
        
      }
      const commentBtn = commentsSection.querySelector(`#comment-btn-${post._id}`);
      commentBtn.addEventListener('click', async () => {
        const commentInput = commentsSection.querySelector(`#comment-input-${post._id}`);
        const commentText = commentInput.value.trim();
        if (commentText) {
          postComment(post._id, commentText, commentBtn);
        }
      }); 
    });

    const shareBtn = postitem.querySelector('.share-btn');
    shareBtn.addEventListener('click', async () => {
      console.log('Share button clicked for post:', post._id);
    });
    return postitem;
};

//toggle like has to send user id to backend and checks if user id is in likes array
const toggleLike = async (postId, likeBtn) => {
  const currentUserId = window.currentUsername;
  const postElement = likeBtn.closest('.post-card');
  const voteCountElem = postElement.querySelector('.vote-count');
  const isLiked = likeBtn.classList.toggle('active');
  const currentCount = parseInt(voteCountElem.textContent);
  voteCountElem.textContent = isLiked ? currentCount + 1 : currentCount - 1;

 
  try {
    const response = await fetch(`${API_BASE_URL}/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId: postId, userId: currentUserId }),
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Server failed to update like status');
    }
    const updatedPost = await response.json();
    // Sync with the final count from the server
    voteCountElem.textContent = updatedPost.likes.length;
  } catch (error) {
    console.error('Error toggling like status:', error);
    // If server fails, revert the UI change
    const wasLiked = likeBtn.classList.toggle('active');
    voteCountElem.textContent = wasLiked ? parseInt(voteCountElem.textContent) - 1 : parseInt(voteCountElem.textContent) + 1;
    icon.className = wasLiked ? 'bi bi-arrow-up-fill' : 'bi bi-arrow-up';
  }
};
const postComment = async (postId, commentText, commentBtn) => {
  const currentUsername = window.currentUsername;

  try {
    const response = await fetch(`${API_BASE_URL}/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: commentText, username: currentUsername , postId: postId }),
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Server failed to post comment');
    }
    const updatedPost = await response.json();
    // Update the UI with the new comment
    const postElement = commentBtn.closest('.post-card');
    const CommentCountElem = postElement.querySelector('.comment-count');
    CommentCountElem.textContent = `${updatedPost.comments.length} Comments`;
    const commentList = document.querySelector(`.comment-list-${postId}`);
    const newComment = document.createElement('li');
    newComment.className = 'mb-2';
    newComment.innerHTML = `<div class="comment-container">
        <div class="comment-author mt-1 mb-1">
          <strong>${currentUsername}</strong>
        </div>
        <div class="comment-text">
          <p class="mt-1 mb-1">${commentText}</p>
        </div>
      </div>`;
    commentList.appendChild(newComment);
  } catch (error) {
    console.error('Error posting comment:', error);
  }
};
const getCommentsByPostId = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${postId}/comments`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const comments = await response.json();
    const commentList = document.querySelector(`.comment-list-${postId}`);
    commentList.innerHTML = '';
    comments.forEach(comment => {
      const commentItem = document.createElement('li');
      commentItem.className = 'mb-2';
      commentItem.innerHTML = 
      `<div class="comment-container">
        <div class="comment-author mt-1 mb-1">
          <strong>${comment.username}</strong>
        </div>
        <div class="comment-text">
          <p class="mt-1 mb-1">${comment.comment}</p>
        </div>
      </div>`;
      commentList.appendChild(commentItem);
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

document.addEventListener('DOMContentLoaded', async function() {
  const postList = document.getElementById('post-list');
        if (postList) {
            // Check if we are on a group page by looking for the data attribute
            const groupName = postList.dataset.groupName;

            if (groupName) {
                // If a group name exists, we are on a group page. Fetch its posts.
                await getPostsByGroupName(groupName);
            } else {
                // Otherwise, we are on the home page. Fetch all posts.
                await getPosts();
            }
        }
    
        

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
 
    });