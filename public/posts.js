API_BASE_URL = '/posts';
const postCreation = document.getElementById('postCreation');

document.addEventListener("DOMContentLoaded", () => {
  // Open modal when clicking the create post button
  document.getElementById('create-post-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('createPostModal').style.display = 'flex';
  });
});

function closeCreatePostModal() {
  document.getElementById('createPostModal').style.display = 'none';
}

function togglePostTypeFields() {
  const type = document.getElementById('postType').value;
  document.getElementById('textFields').style.display = type === 'text' ? 'block' : 'none';
  document.getElementById('imageFields').style.display = type === 'image' ? 'block' : 'none';
  document.getElementById('videoFields').style.display = type === 'video' ? 'block' : 'none';
}
// Toggle fields on initial load
document.addEventListener("DOMContentLoaded", function() {
  const postTypeBtns = document.querySelectorAll('.post-type-btn');
  const hiddenInput = document.getElementById('');


  postTypeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      postTypeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      hiddenInput.value = btn.getAttribute('data-type');
      togglePostTypeFields(); // If you want to show/hide fields
    });
  });

  // Handle form submission for creating a post
  const createPost = document.getElementById('createPostForm');


  if (createPost) {
    createPost.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(createPost);

      try {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const newPost = await response.json();
          closeCreatePostModal();
          renderNewPost(newPost); // Render the new post in the feed
        } else {
          alert('Error creating post');
        }
      } catch (error) {
        alert('Network error');
      }
    });
  }
});

// Render the new post in the feed (customize as needed)
function renderNewPost(post) {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return;

  const container = document.createElement('div');
  container.className = 'post-container';

  let postHtml = `
    <div class="post">
      <h6 class="post-meta">${post.createdBy?.username || 'Anonymous'} • עכשיו</h6>
      <h5 class="post-title">${post.title || ''}</h5>
  `;

  if (post.type === 'image' && post.image?.path) {
    postHtml += `<img class="post-image" src="/${post.image.path}" alt="Post Image">`;
  } else if (post.type === 'video' && post.video?.path) {
    postHtml += `<video controls class="post-video"><source src="/${post.video.path}"></video>`;
  } else {
    postHtml += `<div class="post-content">${post.content}</div>`;
  }

  postHtml += `
      <div class="post-actions">
        <button class="like-btn post-like"><i class="fas fa-arrow-up"></i> <span class="like-count">0</span></button>
      </div>
    </div>
  `;

  container.innerHTML = postHtml;
  mainContent.prepend(container); // Add to top of feed
}