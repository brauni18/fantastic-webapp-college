API_BASE_URL = '/posts';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async function() {
  // Add event listener for the create post button
 const createPostBtn = document.getElementById('create-post-btn');
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
      e.preventDefault(); // Prevent default navigation
      history.pushState(null, '', '/'); // Update URL without reloading
    });
  });
});
const text_button = document.getElementById('post-type-text');
const image_button = document.getElementById('post-type-image');
const video_button = document.getElementById('post-type-video');

// Add event listeners for post type buttons
if (text_button) {
  text_button.addEventListener('click', () => selectPostType('text'));
}
if (image_button) {
  image_button.addEventListener('click', () => selectPostType('image'));
}
if (video_button) {
  video_button.addEventListener('click', () => selectPostType('video'));
}

// Function to select post type and show corresponding input section
const selectPostType = (type) => {
  
  const text_input= document.getElementById('text-input');
  const image_input = document.getElementById('image-input');
  const video_input = document.getElementById('video-input');
  
  // Show selected input section and mark button as active
  if (type === 'text') {
    text_input.style.display = 'block';
    image_input.style.display = 'none';
    video_input.style.display = 'none';
    
    // Add required to text inputs only
    document.getElementById('post-title').setAttribute('required', 'required');
    document.getElementById('post-content-text').setAttribute('required', 'required');

    document.getElementById('image-title').removeAttribute('required');
    document.getElementById('image-file').removeAttribute('required');
    document.getElementById('video-title').removeAttribute('required');
    document.getElementById('video-file').removeAttribute('required');
    
    text_button.classList.add('active');
    image_button.classList.remove('active');
    video_button.classList.remove('active');
    
  } else if (type === 'image') {
    image_input.style.display = 'block';
    text_input.style.display = 'none';
    video_input.style.display = 'none';
    
    // Add required to image inputs only
    document.getElementById('image-title').setAttribute('required', 'required');
    document.getElementById('image-file').setAttribute('required', 'required');

    document.getElementById('post-title').removeAttribute('required');
    document.getElementById('post-content-text').removeAttribute('required');
    document.getElementById('video-title').removeAttribute('required');
    document.getElementById('video-file').removeAttribute('required');
    
    image_button.classList.add('active');
    text_button.classList.remove('active');
    video_button.classList.remove('active');
    
  } else if (type === 'video') {
    video_input.style.display = 'block';
    text_input.style.display = 'none';
    image_input.style.display = 'none';

    // Add required to video inputs only
    document.getElementById('video-title').setAttribute('required', 'required');
    document.getElementById('video-file').setAttribute('required', 'required');

    document.getElementById('post-title').removeAttribute('required');
    document.getElementById('post-content-text').removeAttribute('required');
    document.getElementById('image-title').removeAttribute('required');
    document.getElementById('image-file').removeAttribute('required');

    video_button.classList.add('active');
    text_button.classList.remove('active'); 
    image_button.classList.remove('active');
  }
 
}

const  handlePostSubmit= async (event) => {
  event.preventDefault();

  const createdBy = '64a7f3c4f1d2c8b5e6a7d8e9'; // Example user ID
  const community = document.getElementById('community-select').value; // or set to a valid community ID if needed
  const type = text_button.classList.contains('active') ? 'text' : 
               image_button.classList.contains('active') ? 'image' : 
               video_button.classList.contains('active') ? 'video' : null;
  const formData = new FormData();

  if (type === 'text') {
     const title = document.getElementById('post-title').value;
     const content = document.getElementById('post-content-text').value;

     formData.append('title', title);
    formData.append('content', content);  // Add file to formData
  } else if (type === 'image') {
    const title = document.getElementById('image-title').value;
    const imageFile = document.getElementById('image-file').files[0];

    formData.append('title', title);
    formData.append('image-file', imageFile);  // Add file to formData
  } else if (type === 'video') {
    const title = document.getElementById('video-title').value;
    const videoFile = document.getElementById('video-file').files[0];

    formData.append('title', title);
    formData.append('video-file', videoFile);  // Add file to formData
  }

  formData.append('type', type);  // Add post type
  formData.append('createdBy', createdBy);
  formData.append('community', community); 
  // Log formData entries for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`FormData: ${key} = ${value}`);
  }

  try {
    console.log('Submitting form data to', API_BASE_URL);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
    });
    
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      alert(`Wooopss...Something went wrong. ${response.status}`, errorText);
      return;
    } 
      const newPost = await response.json();
      console.log('Post created:', newPost);
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error: Unable to connect to server');
  }

}

