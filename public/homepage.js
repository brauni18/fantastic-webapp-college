// roei hamihas id-323919829 ---------- tal braunstein  id-207118365
function showBurgerPost(button) {
  const post = document.getElementById('burger-post');
  const visible = post.style.display === 'block';

  post.style.display = visible ? 'none' : 'block'; // הפעלה וכיבוי

  post.classList.add('fade-in'); // אפקט מעבר
  setTimeout(() => post.classList.remove('fade-in'), 300);

  button.classList.add('flash'); // אפקט הבזק
  setTimeout(() => {
    button.classList.remove('flash');
  }, 600);
}


document.addEventListener("DOMContentLoaded", () => {
  const postContainers = document.querySelectorAll(".post-container");

  postContainers.forEach(container => {
    const post = container.querySelector(".post");
    const commentsSection = container.querySelector(".comments");
    const toggleBtn = container.querySelector(".toggle-comments-btn");
    const input = container.querySelector(".comment-form input");
    const sendBtn = container.querySelector(".submit-comment-btn");
    const commentCounter = container.querySelector(".comment-counter");
    const typingIndicator = container.querySelector(".typing-indicator");

    toggleBtn.addEventListener("click", () => {
      if (commentsSection.style.display === "none" || !commentsSection.style.display) {
        commentsSection.style.display = "block";
        toggleBtn.textContent = "הסתר תגובות";
      } else {
        commentsSection.style.display = "none";
        toggleBtn.textContent = "הצג תגובות";
      }
    });

    function addComment(text) {
      const comment = document.createElement("div");
      comment.classList.add("comment");
      comment.innerHTML = `
        <strong>Anonymous</strong>: ${text}
        <div class="comment-actions">
          <button class="like-btn comment-like"><i class="fas fa-arrow-up"></i> <span class="like-count">0</span></button>
          <button class="unlike-btn"><i class="fas fa-arrow-down"></i></button>
          <button class="reply-btn"><i class="fas fa-reply"></i> Reply</button>
        </div>
      `;
      commentsSection.appendChild(comment);
      input.value = "";

      const count = parseInt(commentCounter.textContent);
      commentCounter.textContent = count + 1;

      attachLikeEvents(comment);
    }

    input.addEventListener("input", () => {
      typingIndicator.style.display = input.value.trim() ? "block" : "none";
    });

    sendBtn.addEventListener("click", () => {
      if (input.value.trim()) {
        addComment(input.value.trim());
        typingIndicator.style.display = "none";
      }
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (input.value.trim()) {
          addComment(input.value.trim());
          typingIndicator.style.display = "none";
        }
      }
    });
  });

  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const searchInput = document.querySelector(".search-bar input");
  const postContainersAll = document.querySelectorAll(".post-container");
  const noResultsMessage = document.getElementById("no-results");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      let found = false;

      postContainersAll.forEach(container => {
        const post = container.querySelector(".post");
        const title = post.querySelector(".post-title").textContent.toLowerCase();
        const meta = post.querySelector(".post-meta").textContent.toLowerCase();

        if (title.includes(query) || meta.includes(query)) {
          container.style.display = "block";
          found = true;
        } else {
          container.style.display = "none";
        }
      });

      noResultsMessage.style.display = found ? "none" : "block";
    });
  }

  function attachLikeEvents(root = document) {
    root.querySelectorAll(".like-btn").forEach(button => {
      let liked = false;
      const countSpan = button.querySelector(".like-count");

      button.addEventListener("click", () => {
        button.style.transform = "scale(1.2)";
        setTimeout(() => button.style.transform = "scale(1)", 150);
        const current = parseInt(countSpan.textContent);
        countSpan.textContent = liked ? current - 1 : current + 1;
        button.style.color = liked ? "#7c7c7c" : "red";
        liked = !liked;
      });
    });

    root.querySelectorAll(".unlike-btn").forEach(button => {
      let unliked = false;

      button.addEventListener("click", () => {
        button.style.transform = "scale(1.2)";
        setTimeout(() => button.style.transform = "scale(1)", 150);
        button.style.color = unliked ? "#7c7c7c" : "purple";
        unliked = !unliked;
      });
    });
  }

  attachLikeEvents();

  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
  });

  document.addEventListener("click", function (event) {
    if (event.target.closest(".delete-post-btn")) {
      const post = event.target.closest(".post-container");
      if (post) {
        const confirmed = confirm("Are you sure you want to delete this post?");
        if (confirmed) {
          post.remove();
        }
      }
    }
  });

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".share-dropdown").forEach(drop => {
      if (!drop.contains(e.target)) drop.style.display = "none";
    });

    const shareBtn = e.target.closest(".share-btn");
    if (shareBtn) {
      const wrapper = shareBtn.closest(".share-dropdown-wrapper");
      const dropdown = wrapper.querySelector(".share-dropdown");
      dropdown.style.display = dropdown.style.display === "none" || !dropdown.style.display ? "block" : "none";
      e.stopPropagation();
    }
  });

  // תפריט סוג פוסט (בתוך החלונית הימנית)
  const typeToggle = document.getElementById("post-type-toggle");
  const typeMenu = document.getElementById("post-type-menu");

  if (typeToggle && typeMenu) {
    typeToggle.addEventListener("click", () => {
      typeMenu.style.display = typeMenu.style.display === "none" || !typeMenu.style.display ? "block" : "none";
    });

    document.addEventListener("click", (e) => {
      if (!typeMenu.contains(e.target) && e.target !== typeToggle) {
        typeMenu.style.display = "none";
      }
    });

    document.querySelectorAll(".post-type-option").forEach(button => {
      button.addEventListener("click", () => {
        const selectedType = button.dataset.type;
        typeMenu.style.display = "none";

        // סינון פוסטים לפי סוג
        document.querySelectorAll(".post-container").forEach(container => {
          const type = container.dataset.type;
          container.style.display = selectedType === "all" || type === selectedType ? "block" : "none";
        });

        // הודעת פוסט חדש
        const notification = document.createElement("div");
        notification.textContent = "יש פוסט חדש!";
        notification.style = "position:fixed; top:20px; right:20px; background:#ff4500; color:white; padding:10px 20px; border-radius:8px; font-weight:bold; z-index:99999";
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      });
    });
  }
});

