/* ==========================================================================
   Blog rendering — reads blogData (blog-data.js) and renders one card per
   post into #blogGrid. Keeps markup generation separate from blog-data.js
   (content) and blog.js (page behaviour: bookmarks, comments, offline, etc).
   ========================================================================== */

function renderBlogPosts() {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  grid.innerHTML = blogData.map(renderBlogCard).join("");
}

function renderBlogCard(post) {
  const paragraphs = post.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");

  const quote = post.quote
    ? `<blockquote>${escapeHtml(post.quote.text)}${
        post.quote.cite ? ` – ${escapeHtml(post.quote.cite)}` : ""
      }</blockquote>`
    : "";

  const authorNote = post.authorNote
    ? `<p class="author-note"><em>${escapeHtml(post.authorNote)}</em></p>`
    : "";

  return `
    <article class="blog-card blog-card--${post.accent}" data-blog-id="${post.id}">
      <div class="blog-text">
        <button class="bookmark-btn" data-blog-id="${post.id}" aria-label="Bookmark this post">☆</button>
        <h2 class="blog-title">${escapeHtml(post.title)}</h2>
        <p class="author">By <strong>${escapeHtml(post.author)}</strong></p>
        <span class="reading-time">⏱️ ${escapeHtml(post.readingTime)}</span>
        ${paragraphs}
        ${quote}
        ${authorNote}
        <button class="comment-toggle-btn" data-blog-id="${post.id}">
          💬 View Comments
        </button>
      </div>
    </article>
  `;
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}