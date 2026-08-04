/* ==========================================================================
   Blog page logic
   Handles: nav menu toggle, reading-progress bar, bookmarks + comments
   (IndexedDB via Dexie), read-article tracking (localStorage), the offline
   banner/toast, and the "save for offline" button.
   Requires blog-data.js + blog-render.js to run first (see blog.html),
   and Dexie to already be loaded on the page.
   ========================================================================== */

let db = null;
let currentBlogId = null;

/* ---------- IndexedDB (Dexie) ---------- */

async function initBlogDB() {
  if (typeof Dexie === "undefined") {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  db = new Dexie("MediaOnAfricaBlog");
  db.version(1).stores({
    bookmarks: "++id, blogId, timestamp",
    comments: "++id, blogId, author, content, timestamp",
  });

  await db.open();
  await loadBookmarks();
}

/* ---------- Bookmarks ---------- */

async function toggleBookmark(blogId, btnElement) {
  const existing = await db.bookmarks.where("blogId").equals(blogId).first();

  if (existing) {
    await db.bookmarks.delete(existing.id);
    btnElement.classList.remove("bookmarked");
    btnElement.textContent = "☆";
    showNotification("Removed from bookmarks", "info");
  } else {
    await db.bookmarks.add({ blogId, timestamp: new Date().toISOString() });
    btnElement.classList.add("bookmarked");
    btnElement.textContent = "★";
    showNotification("Added to bookmarks", "success");
  }
}

async function loadBookmarks() {
  if (!db) return;

  const bookmarks = await db.bookmarks.toArray();
  const bookmarkIds = new Set(bookmarks.map((b) => b.blogId));

  document.querySelectorAll(".bookmark-btn").forEach((btn) => {
    const blogId = parseInt(btn.getAttribute("data-blog-id"));
    if (bookmarkIds.has(blogId)) {
      btn.classList.add("bookmarked");
      btn.textContent = "★";
    } else {
      btn.classList.remove("bookmarked");
      btn.textContent = "☆";
    }
  });
}

/* ---------- Comments ---------- */

async function loadComments(blogId) {
  if (!db) return;

  const comments = await db.comments.where("blogId").equals(blogId).reverse().toArray();
  const container = document.getElementById("commentsList");

  if (comments.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center;">No comments yet. Start the discussion!</p>';
    return;
  }

  container.innerHTML = comments
    .map(
      (comment) => `
      <div class="comment">
        <div class="comment-author">${escapeHtml(comment.author || "Anonymous")}</div>
        <div class="comment-date">${new Date(comment.timestamp).toLocaleString()}</div>
        <div>${escapeHtml(comment.content)}</div>
      </div>
    `,
    )
    .join("");
}

async function addComment(blogId, author, content) {
  if (!content.trim()) {
    showNotification("Please enter a comment", "error");
    return;
  }

  const comment = {
    blogId,
    author: author.trim() || "Anonymous",
    content: content.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    await db.comments.add(comment);
    await loadComments(blogId);
    document.getElementById("commentInput").value = "";
    document.getElementById("commentAuthor").value = "";
    showNotification("Comment saved locally!", "success");
  } catch (error) {
    console.error("Failed to save comment:", error);
    showNotification("Failed to save comment", "error");
  }
}

/* ---------- Read-article tracking (localStorage) ---------- */

function markAsRead(blogId) {
  const readArticles = JSON.parse(localStorage.getItem("read_articles") || "[]");
  if (!readArticles.includes(blogId)) {
    readArticles.push(blogId);
    localStorage.setItem("read_articles", JSON.stringify(readArticles));
  }
}

function showReadingStats() {
  const readArticles = JSON.parse(localStorage.getItem("read_articles") || "[]");
  if (readArticles.length === 0) return;

  const statsDiv = document.createElement("p");
  statsDiv.className = "reading-stats";
  // statsDiv.textContent = `📚 You've read ${readArticles.length} of ${blogData.length} articles`;
  document.querySelector(".button-container").appendChild(statsDiv);
}

/* ---------- Reading progress bar ---------- */

function updateReadingProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
  const progressBar = document.getElementById("readingProgress");
  if (progressBar) progressBar.style.width = scrollPercent + "%";
}

/* ---------- Notifications ---------- */

function showNotification(message, type = "success") {
  const toast = document.getElementById("notificationToast");
  toast.textContent = message;
  toast.style.background = type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ---------- Save page for offline ---------- */

async function downloadBlogOffline() {
  const btn = document.getElementById("downloadBlogBtn");
  const originalText = btn.innerHTML;
  btn.innerHTML = "⏳ Downloading blog posts...";
  btn.disabled = true;

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const assetsToCache = [
      window.location.href,
      "styles.css",
      "home.css",
      "blog.css",
      "blog-data.js",
      "blog-render.js",
      "blog.js",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
      "https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.js",
    ];

    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_NEW_ASSETS",
      urls: assetsToCache,
    });

    setTimeout(() => {
      btn.innerHTML = "✓ Blog Saved for Offline!";
      showNotification("All blog posts saved for offline reading!", "success");
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    }, 2000);
  } else {
    btn.innerHTML = originalText;
    btn.disabled = false;
    showNotification("Please refresh and try again", "error");
  }
}

/* ---------- Offline banner ---------- */

function updateOfflineUI() {
  const banner = document.getElementById("offlineBanner");
  if (!navigator.onLine) {
    banner.classList.add("show");
    showNotification("Offline mode - blog posts available for reading", "info");
  } else {
    banner.classList.remove("show");
  }
}

/* ---------- Nav menu ---------- */

function showmenu() {
  const navLinks = document.getElementById("navLinks");
  const mainNav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");
  if (navLinks) navLinks.style.right = "0";
  if (mainNav) mainNav.classList.add("menu-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
}

function hidemenu() {
  const navLinks = document.getElementById("navLinks");
  const mainNav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");
  if (navLinks) navLinks.style.right = "-260px";
  if (mainNav) mainNav.classList.remove("menu-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) hidemenu();
});

/* ---------- Service worker registration ---------- */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => console.log("ServiceWorker registered:", registration.scope))
      .catch((error) => console.log("ServiceWorker registration failed:", error));
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", async () => {
  renderBlogPosts();
  await initBlogDB();
  updateOfflineUI();

  window.addEventListener("scroll", updateReadingProgress);

  document.querySelectorAll(".bookmark-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const blogId = parseInt(btn.getAttribute("data-blog-id"));
      toggleBookmark(blogId, btn);
    });
  });

  const commentsSection = document.getElementById("commentsSection");

  document.querySelectorAll(".comment-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const blogId = parseInt(btn.getAttribute("data-blog-id"));
      currentBlogId = blogId;
      commentsSection.classList.remove("hidden");
      await loadComments(blogId);
      commentsSection.scrollIntoView({ behavior: "smooth" });
    });
  });

  const submitBtn = document.getElementById("submitCommentBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      if (currentBlogId) {
        const author = document.getElementById("commentAuthor").value;
        const content = document.getElementById("commentInput").value;
        addComment(currentBlogId, author, content);
      }
    });
  }

  const closeBtn = document.getElementById("closeCommentsBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      commentsSection.classList.add("hidden");
      currentBlogId = null;
    });
  }

  const downloadBtn = document.getElementById("downloadBlogBtn");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadBlogOffline);

  const dismissBtn = document.getElementById("dismissBanner");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => {
      document.getElementById("offlineBanner").classList.remove("show");
    });
  }

  const retryBtn = document.getElementById("retryConnection");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      if (navigator.onLine) {
        location.reload();
      } else {
        showNotification("Still offline. Please check your connection.", "error");
      }
    });
  }

  document.querySelectorAll(".blog-card").forEach((card) => {
    card.addEventListener("click", () => {
      const blogId = parseInt(card.getAttribute("data-blog-id"));
      markAsRead(blogId);
    });
  });

  showReadingStats();
});

window.addEventListener("online", () => {
  updateOfflineUI();
  showNotification("Back online!", "success");
});

window.addEventListener("offline", () => {
  updateOfflineUI();
});