/* =========================================================
   Discussion Forum — behavior
   CyberSafe-protected comment system (post, like, dislike,
   reply) with online + offline paths, now scoped per
   grade/subject thread, plus shared nav menu.

   Requires cybersafe-offline.js, cybersafe-queue.js, and
   cybersafe-integration.js to already be loaded, plus
   forum-data.js and forum-render.js.

   NOTE ON THREADING (placeholder, front-end only):
   The CyberSafe comments API has no category/grade field yet.
   Until the backend adds one, each posted comment still sends
   a descriptive `location` string (e.g. "... — Grade 10 —
   Mathematics") for the backend team's future use, AND this
   browser tags the comment's id to its thread in localStorage.
   Loading a thread filters the full comment list down to ids
   mapped to that thread on THIS device. "General Discussion"
   also shows any legacy/unmapped comments so nothing is lost.
   This means a comment will only visibly "belong" to its
   grade/subject room on the same browser that posted it, until
   real backend filtering exists — swap this out once that
   lands.
   ========================================================= */

/* ---------- Nav menu (shared pattern) ---------- */
var navLinks = document.getElementById("navLinks");
function showmenu() {
  document.querySelector(".navbar")?.classList.add("menu-open");
  if (navLinks) navLinks.style.right = "0";
}
function hidemenu() {
  document.querySelector(".navbar")?.classList.remove("menu-open");
  if (navLinks) navLinks.style.right = "-280px";
}

/* ---------- Forum thread navigation + CyberSafe comment engine ---------- */
const ForumThread = (function () {
  const API = "https://cybersafe-africa.onrender.com/api";
  const LOCATION_BASE = "Media On Africa Learning Platform — Forum";
  const THREAD_MAP_KEY = "moaForumThreadMap";

  const nameEl = document.getElementById("cs-name");
  const textEl = document.getElementById("cs-text");
  const btnEl = document.getElementById("cs-btn");
  const statusEl = document.getElementById("cs-status");
  const bannerEl = document.getElementById("cs-banner");
  const listEl = document.getElementById("cs-list");
  const countEl = document.getElementById("cs-count");

  const engineReady =
    nameEl && textEl && btnEl && statusEl && bannerEl && listEl && countEl;
  if (!engineReady) {
    console.warn("CyberSafe comment engine: expected DOM elements not found — skipping init.");
  }

  /* current thread state */
  let currentGrade = null;
  let currentSubject = null;
  let currentThreadKey = null; // e.g. "grade10::mathematics"
  let total = 0;

  /* ---------- localStorage thread map (placeholder filtering) ---------- */
  const getThreadMap = () => {
    try {
      return JSON.parse(localStorage.getItem(THREAD_MAP_KEY)) || {};
    } catch {
      return {};
    }
  };
  const saveThreadMap = (map) => {
    try {
      localStorage.setItem(THREAD_MAP_KEY, JSON.stringify(map));
    } catch {
      /* localStorage unavailable — filtering degrades gracefully to "show all" */
    }
  };
  const tagCommentToThread = (commentId, threadKey) => {
    if (!commentId || !threadKey) return;
    const map = getThreadMap();
    map[commentId] = threadKey;
    saveThreadMap(map);
  };
  const normalizeId = (id) => id?.$oid || id?.toString?.() || id;

  /* ---------- status / banner helpers ---------- */
  const setStatus = (state, msg) => {
    statusEl.className = `cs-status ${state}`;
    statusEl.querySelector(".cs-msg").textContent = msg;
    textEl.className = state === "scan" || state === "blocked" ? state : "";
  };
  const setBanner = (type, title, reason) => {
    bannerEl.className = `cs-banner ${type}`;
    const icons = { safe: "✅", threat: "🚨", offline: "⚡" };
    bannerEl.querySelector(".cs-banner-icon").textContent = icons[type] || "⚠️";
    bannerEl.querySelector(".cs-banner-title").textContent = title;
    bannerEl.querySelector(".cs-banner-reason").textContent = reason;
  };
  const clearBanner = () => {
    bannerEl.className = "cs-banner";
  };
  const resetThreadUI = () => {
    listEl.innerHTML = `<div class="cs-loading"><i class="fa fa-spinner fa-spin"></i> Loading comments…</div>`;
    countEl.textContent = "0 comments";
    textEl.value = "";
    nameEl.value = "";
    clearBanner();
    setStatus("", "🔐 Protected by CyberSafe Africa");
    total = 0;
  };

  const sanitize = (str) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const linkify = (str) =>
    str.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  const timeStr = (iso) => {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  /* ---------- render a reply ---------- */
  const buildReply = (reply, commentId) => {
    const div = document.createElement("div");
    div.className = "cs-reply-card";
    div.dataset.replyId = reply._id;
    div.innerHTML = `
      <div class="cs-reply-av">${(reply.name || "S").charAt(0).toUpperCase()}</div>
      <div class="cs-reply-body">
        <span class="cs-reply-name">${sanitize(reply.name || "Student")}</span>
        <span class="cs-reply-time">${timeStr(reply.createdAt)}</span>
        <div class="cs-reply-text">${linkify(sanitize(reply.text ?? reply.body ?? ""))}</div>
        <div class="cs-reply-actions">
          <button class="cs-reply-action" data-action="like">
            <i class="fa fa-thumbs-up"></i> <span class="rl-count">${reply.likes || 0}</span>
          </button>
          <button class="cs-reply-action" data-action="dislike">
            <i class="fa fa-thumbs-down"></i> <span class="rd-count">${reply.dislikes || 0}</span>
          </button>
        </div>
      </div>
    `;

    div.querySelector('[data-action="like"]').addEventListener("click", async function () {
      if (!navigator.onLine) return;
      const res = await fetch(`${API}/comments/${commentId}/replies/${reply._id}/like`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) this.querySelector(".rl-count").textContent = data.likes;
    });
    div.querySelector('[data-action="dislike"]').addEventListener("click", async function () {
      if (!navigator.onLine) return;
      const res = await fetch(`${API}/comments/${commentId}/replies/${reply._id}/dislike`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) this.querySelector(".rd-count").textContent = data.dislikes;
    });

    return div;
  };

  /* ---------- render a full comment card ---------- */
  const buildCard = (comment, isOfflinePending = false) => {
    const card = document.createElement("div");
    card.className = "cs-card" + (isOfflinePending ? " cs-offline-pending" : "");
    card.dataset.id = comment._id || "offline-" + Date.now();

    const verifiedBadge = isOfflinePending
      ? `<span class="cs-pending-badge">⏳ AI scan pending</span>`
      : `<span class="cs-verified"><i class="fa fa-shield"></i> Verified safe</span>`;

    card.innerHTML = `
      <div class="cs-card-top">
        <div class="cs-av">${(comment.name || "S").charAt(0).toUpperCase()}</div>
        <div class="cs-card-meta">
          <span class="cs-card-name">${sanitize(comment.name || "Student")}</span>
          <span class="cs-card-time">${timeStr(comment.createdAt)}</span>
        </div>
        ${verifiedBadge}
      </div>
      <div class="cs-card-body">${linkify(sanitize(comment.text ?? comment.body ?? ""))}</div>
      <div class="cs-actions">
        <button class="cs-action-btn like-btn">
          <i class="fa fa-thumbs-up"></i> <span class="like-count">${comment.likes || 0}</span>
        </button>
        <button class="cs-action-btn dislike-btn">
          <i class="fa fa-thumbs-down"></i> <span class="dislike-count">${comment.dislikes || 0}</span>
        </button>
        <button class="cs-reply-toggle">
          <i class="fa fa-reply"></i> Reply
          ${comment.replies?.length ? `(${comment.replies.length})` : ""}
        </button>
      </div>
      <div class="cs-replies">
        <div class="cs-replies-list"></div>
        <div class="cs-reply-form">
          <textarea class="cs-reply-input" placeholder="Write a reply…" maxlength="500" rows="1"></textarea>
          <button class="cs-reply-submit">Reply</button>
        </div>
      </div>
    `;

    const repliesEl = card.querySelector(".cs-replies");
    const repliesList = card.querySelector(".cs-replies-list");
    const replyToggle = card.querySelector(".cs-reply-toggle");
    const replyInput = card.querySelector(".cs-reply-input");
    const replySubmit = card.querySelector(".cs-reply-submit");
    const likeBtn = card.querySelector(".like-btn");
    const dislikeBtn = card.querySelector(".dislike-btn");

    (comment.replies || []).forEach((r) => repliesList.appendChild(buildReply(r, comment._id)));

    replyToggle.addEventListener("click", () => repliesEl.classList.toggle("open"));

    likeBtn.addEventListener("click", async function () {
      if (!navigator.onLine || this.classList.contains("liked")) return;
      const res = await fetch(`${API}/comments/${comment._id}/like`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        this.querySelector(".like-count").textContent = data.likes;
        this.classList.add("liked");
      }
    });

    dislikeBtn.addEventListener("click", async function () {
      if (!navigator.onLine || this.classList.contains("disliked")) return;
      const res = await fetch(`${API}/comments/${comment._id}/dislike`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        this.querySelector(".dislike-count").textContent = data.dislikes;
        this.classList.add("disliked");
      }
    });

    replySubmit.addEventListener("click", async () => {
      const body = replyInput.value.trim();
      if (!body) return;

      replySubmit.disabled = true;
      replySubmit.textContent = "Scanning…";

      if (!navigator.onLine) {
        const offResult = window.CyberSafeOfflineEngine
          ? window.CyberSafeOfflineEngine.scan(body)
          : {
              safe: false,
              threats: [{ label: "Engine unavailable" }],
              summary: "Offline engine not loaded — blocked for safety.",
            };

        if (!offResult.safe) {
          replyInput.style.borderColor = "#e74c3c";
          replyInput.title = offResult.summary;
          setTimeout(() => {
            replyInput.style.borderColor = "";
            replyInput.title = "";
          }, 3000);
          replySubmit.disabled = false;
          replySubmit.textContent = "Reply";
          return;
        }

        if (window.CyberSafeQueue) {
          await window.CyberSafeQueue.enqueue(body, {
            type: "reply",
            commentId: comment._id,
            author: "Student",
            offlineResult: offResult,
          });
        }

        repliesList.appendChild(
          buildReply(
            {
              _id: "pending-" + Date.now(),
              name: "Student",
              body,
              createdAt: new Date().toISOString(),
              likes: 0,
              dislikes: 0,
            },
            comment._id,
          ),
        );

        replyInput.value = "";
        repliesEl.classList.add("open");
        const count = repliesList.querySelectorAll(".cs-reply-card").length;
        replyToggle.innerHTML = `<i class="fa fa-reply"></i> Reply (${count})`;
        replySubmit.disabled = false;
        replySubmit.textContent = "Reply";
        return;
      }

      try {
        const res = await fetch(`${API}/comments/${comment._id}/replies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Student", body, text: body, location: currentLocationLabel() }),
        });
        const data = await res.json();

        if (data.blocked) {
          replyInput.style.borderColor = "#e74c3c";
          replyInput.title = data.threat?.reason || "Reply blocked";
          setTimeout(() => {
            replyInput.style.borderColor = "";
            replyInput.title = "";
          }, 3000);
        } else if (data.success) {
          repliesList.appendChild(buildReply(data.data, comment._id));
          replyInput.value = "";
          repliesEl.classList.add("open");
          const count = repliesList.querySelectorAll(".cs-reply-card").length;
          replyToggle.innerHTML = `<i class="fa fa-reply"></i> Reply (${count})`;
        }
      } catch {
        replyInput.style.borderColor = "#e74c3c";
        replyInput.title = "Reply failed — no connection.";
        setTimeout(() => {
          replyInput.style.borderColor = "";
          replyInput.title = "";
        }, 3000);
      }

      replySubmit.disabled = false;
      replySubmit.textContent = "Reply";
    });

    replyInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        replySubmit.click();
      }
    });

    return card;
  };

  const currentLocationLabel = () =>
    currentGrade && currentSubject
      ? `${LOCATION_BASE} — ${currentGrade.label} — ${currentSubject.label}`
      : LOCATION_BASE;

  /* ---------- load + filter comments for the current thread ---------- */
  const loadComments = async () => {
    if (!currentThreadKey) return;

    if (!navigator.onLine) {
      listEl.innerHTML = `
        <div class="cs-empty">
          <i class="fa fa-wifi"></i>
          You're offline. Previously loaded comments aren't cached yet.<br>
          <small>Connect to load community comments. Your posts will sync when you're back online.</small>
        </div>`;
      countEl.textContent = "offline";
      return;
    }

    try {
      const res = await fetch(`${API}/comments?t=${Date.now()}`, { headers: { "Cache-Control": "no-cache" } });
      const data = await res.json();

      const allComments = data.data || [];
      const threadMap = getThreadMap();

      const visible = allComments.filter((c) => {
        const id = normalizeId(c._id);
        if (currentThreadKey === "general") {
          return !threadMap[id] || threadMap[id] === "general";
        }
        return threadMap[id] === currentThreadKey;
      });

      listEl.innerHTML = "";
      total = visible.length;
      countEl.textContent = `${total} comment${total !== 1 ? "s" : ""}`;

      if (visible.length === 0) {
        listEl.innerHTML = `<div class="cs-empty"><i class="fa fa-comment-o"></i>No comments yet in this room. Be the first to start the discussion!</div>`;
        return;
      }

      visible.forEach((c) => {
        try {
          c._id = normalizeId(c._id);
          listEl.appendChild(buildCard(c));
        } catch (err) {
          console.error("Failed to render comment:", err, c);
        }
      });
    } catch (err) {
      console.error("loadComments failed:", err);
      listEl.innerHTML = `<div class="cs-empty"><i class="fa fa-comment-o"></i>Could not load comments.</div>`;
    }
  };

  /* ---------- submit new comment — online + offline paths ---------- */
  const submit = async () => {
    const text = textEl.value.trim();
    if (!text) {
      textEl.focus();
      return;
    }

    btnEl.disabled = true;
    clearBanner();

    /* OFFLINE PATH */
    if (!navigator.onLine) {
      setStatus("scan", "Scanning with offline engine…");

      const offResult = window.CyberSafeOfflineEngine
        ? window.CyberSafeOfflineEngine.scan(text)
        : {
            safe: false,
            riskLevel: "HIGH",
            threats: [{ label: "Engine unavailable" }],
            summary: "Offline engine not loaded — blocked for safety.",
          };

      if (!offResult.safe) {
        setStatus("blocked", `${offResult.threats[0]?.label || "Threat"} blocked`);
        setBanner("threat", `${offResult.threats[0]?.label || "Threat detected"} — offline scan`, offResult.summary);
        textEl.animate(
          [
            { transform: "translateX(0)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(0)" },
          ],
          { duration: 380, easing: "ease-out" },
        );
        btnEl.disabled = false;
        return;
      }

      const authorName = nameEl.value.trim() || "Student";
      const localId = "offline-" + Date.now();
      const localComment = {
        _id: localId,
        name: authorName,
        body: text,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
      };

      tagCommentToThread(localId, currentThreadKey);

      listEl.querySelector(".cs-empty")?.remove();
      listEl.prepend(buildCard(localComment, true));
      total++;
      countEl.textContent = `${total} comment${total !== 1 ? "s" : ""}`;

      textEl.value = "";
      nameEl.value = "";
      setStatus("offline", "⚡ Saved offline — queued for AI scan");
      setBanner(
        "offline",
        "Posted offline",
        "Your comment passed offline safety checks and will be AI-scanned when you reconnect.",
      );
      setTimeout(() => {
        setStatus("", "🔐 Protected by CyberSafe Africa");
        clearBanner();
      }, 5000);

      btnEl.disabled = false;
      return;
    }

    /* ONLINE PATH */
    setStatus("scan", "Scanning your comment…");

    try {
      const res = await fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameEl.value.trim() || "Student",
          body: text,
          text: text,
          location: currentLocationLabel(),
        }),
      });
      const data = await res.json();

      if (data.blocked) {
        setStatus("blocked", `${data.threat.type} blocked`);
        setBanner(
          "threat",
          `${data.threat.type} detected — ${data.threat.confidence}% confidence`,
          data.threat.reason || "This comment was flagged as harmful.",
        );
        textEl.animate(
          [
            { transform: "translateX(0)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(-4px)" },
            { transform: "translateX(4px)" },
            { transform: "translateX(0)" },
          ],
          { duration: 380, easing: "ease-out" },
        );
      } else if (data.success) {
        const newId = normalizeId(data.data._id);
        data.data._id = newId;
        tagCommentToThread(newId, currentThreadKey);

        listEl.querySelector(".cs-empty")?.remove();
        listEl.prepend(buildCard(data.data));
        total++;
        countEl.textContent = `${total} comment${total !== 1 ? "s" : ""}`;
        textEl.value = "";
        nameEl.value = "";
        setStatus("safe", "Comment posted ✓");
        setBanner("safe", "Comment approved", "Passed all CyberSafe safety checks.");
        setTimeout(() => {
          setStatus("", "🔐 Protected by CyberSafe Africa");
          clearBanner();
        }, 3500);
      }
    } catch {
      setStatus("", "🔐 Protected by CyberSafe Africa");
      setBanner("threat", "Connection error", "Could not reach the server. Please try again.");
    }

    btnEl.disabled = false;
  };

  /* ---------- one-time event bindings ---------- */
  if (engineReady) {
    textEl.addEventListener("input", () => {
      setStatus("", "🔐 Protected by CyberSafe Africa");
      clearBanner();
    });
    btnEl.addEventListener("click", submit);
    textEl.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submit();
    });
    window.addEventListener("online", () => {
      if (currentThreadKey && listEl.querySelector(".cs-empty")) loadComments();
    });
  }

  /* ---------- navigation: grade → subject → thread ---------- */
  function selectGrade(grade) {
    currentGrade = grade;
    currentSubject = null;
    currentThreadKey = null;
    if (typeof renderForumSubjects === "function") renderForumSubjects(grade);
    if (typeof forumSetBreadcrumb === "function") forumSetBreadcrumb(grade.label);
    if (typeof forumShowView === "function") forumShowView("forum-view-subjects");
  }

  function selectSubject(subject) {
    if (!currentGrade) return;
    currentSubject = subject;
    currentThreadKey = `${currentGrade.id}::${subject.id}`;

    const titleEl = document.getElementById("forumThreadTitle");
    if (titleEl) titleEl.textContent = `${currentGrade.label} — ${subject.label}`;

    if (typeof forumSetBreadcrumb === "function") {
      forumSetBreadcrumb(`${currentGrade.label} > ${subject.label}`);
    }
    if (typeof forumShowView === "function") forumShowView("forum-view-thread");

    if (engineReady) {
      resetThreadUI();
      loadComments();
    }
  }

  function goBack() {
    if (currentThreadKey) {
      // thread -> subjects
      currentSubject = null;
      currentThreadKey = null;
      if (typeof forumSetBreadcrumb === "function") forumSetBreadcrumb(currentGrade.label);
      if (typeof forumShowView === "function") forumShowView("forum-view-subjects");
    } else if (currentGrade) {
      // subjects -> grades
      currentGrade = null;
      if (typeof forumShowView === "function") forumShowView("forum-view-grades");
    }
  }

  return { selectGrade, selectSubject, goBack };
})();

window.ForumThread = ForumThread;