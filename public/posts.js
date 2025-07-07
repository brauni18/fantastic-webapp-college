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

document.addEventListener("DOMContentLoaded", function() {
  const btns = document.querySelectorAll('.post-type-btn');
  const hiddenInput = document.getElementById('postType');
  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      btns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      hiddenInput.value = btn.getAttribute('data-type');
      togglePostTypeFields(); // If you want to show/hide fields
    });
  });
  const createPostForm = document.getElementById('createPostForm');
  if (createPostForm) {
    createPostForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Get selected post type
      const type = document.getElementById('postType').value;
      let title = '';
      let content = '';
      let imageUrl = '';
      let videoUrl = '';

      if (type === 'text') {
        title = createPostForm.querySelector('#textFields input[name="title"]').value;
        content = createPostForm.querySelector('#textFields textarea[name="content"]').value;
      } else if (type === 'image') {
        title = createPostForm.querySelector('#imageFields input[name="title"]').value;
        imageUrl = createPostForm.querySelector('input[name="imageUrl"]').value;
      } else if (type === 'video') {
        title = createPostForm.querySelector('#videoFields input[name="title"]').value;
        videoUrl = createPostForm.querySelector('input[name="videoUrl"]').value;
      }

      // Build the post data object
      const postData = { type, title, content, imageUrl, videoUrl };

      // Send to backend (adjust URL if needed)
      const response = await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        // Optionally close modal and update UI
        closeCreatePostModal();
        // You can also fetch and render the new post here
        alert('Post created!');
      } else {
        alert('Error creating post');
      }
    });
  }
});