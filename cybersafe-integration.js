(function () {
  "use strict";

  /* ─────────────────────────────────
CONFIG
───────────────────────────────── */
  const CONFIG = {
    apiUrl: "https://cybersafe-africa.onrender.com/api",
    platform: "Media On Africa",
    minTextLength: 10, // don't scan very short inputs
    debounceMs: 700, // wait 700ms after user stops typing
  };

  /* ─────────────────────────────────
UTILITIES
───────────────────────────────── */

  const debounce = (fn, ms) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  const isExternalLink = (href) => {
    try {
      return new URL(href).origin !== window.location.origin;
    } catch {
      return false;
    }
  };

  /** Fire-and-forget activity report to CyberSafe backend */
  const reportActivity = (payload) => {
    fetch(`${CONFIG.apiUrl}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, location: CONFIG.platform }),
    }).catch(() => {});
  };

  /* ─────────────────────────────────
TOAST ALERTS
Shows students a warning when
a threat is detected on the page.
───────────────────────────────── */
  const injectToastStyles = () => {
    if (document.getElementById("cs-toast-styles")) return;
    const s = document.createElement("style");
    s.id = "cs-toast-styles";
    s.textContent = `
#cs-toast-container {
position: fixed;
top: 20px;
right: 20px;
z-index: 99999;
display: flex;
flex-direction: column;
gap: 10px;
pointer-events: none;
}
.cs-toast {
pointer-events: all;
display: flex;
align-items: flex-start;
gap: 12px;
padding: 14px 16px;
border-radius: 12px;
box-shadow: 0 8px 32px rgba(0,0,0,0.18);
font-family: 'Poppins', sans-serif;
font-size: 13px;
max-width: 320px;
animation: cs-slide-in 0.3s cubic-bezier(0.16,1,0.3,1) both;
backdrop-filter: blur(8px);
}
.cs-toast.threat {
background: rgba(255,245,245,0.97);
border: 1px solid #ffcccc;
border-left: 4px solid #e53e3e;
color: #742a2a;
}
.cs-toast.warning {
background: rgba(255,252,235,0.97);
border: 1px solid #fbd38d;
border-left: 4px solid #d69e2e;
color: #744210;
}
.cs-toast-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.cs-toast-body strong { display: block; font-weight: 700; margin-bottom: 2px; }
.cs-toast-body span { opacity: 0.8; line-height: 1.4; }
.cs-toast-close {
margin-left: auto;
background: none;
border: none;
cursor: pointer;
opacity: 0.4;
font-size: 16px;
padding: 0;
line-height: 1;
flex-shrink: 0;
color: inherit;
}
.cs-toast-close:hover { opacity: 0.8; }
@keyframes cs-slide-in {
from { opacity: 0; transform: translateX(20px); }
to { opacity: 1; transform: translateX(0); }
}
@keyframes cs-slide-out {
from { opacity: 1; transform: translateX(0); max-height: 200px; }
to { opacity: 0; transform: translateX(20px); max-height: 0; }
}
`;
    document.head.appendChild(s);
  };

  const getToastContainer = () => {
    let c = document.getElementById("cs-toast-container");
    if (!c) {
      c = document.createElement("div");
      c.id = "cs-toast-container";
      document.body.appendChild(c);
    }
    return c;
  };

  const showToast = (type, title, message, duration = 6000) => {
    injectToastStyles();
    const icons = { threat: "🚨", warning: "⚠️" };
    const toast = document.createElement("div");
    toast.className = `cs-toast ${type}`;
    toast.innerHTML = `
<span class="cs-toast-icon">${icons[type] || "⚠️"}</span>
<div class="cs-toast-body">
<strong>${title}</strong>
<span>${message}</span>
</div>
<button class="cs-toast-close" aria-label="Dismiss">✕</button>
`;
    toast.querySelector(".cs-toast-close").onclick = () => removeToast(toast);
    getToastContainer().appendChild(toast);
    if (duration) setTimeout(() => removeToast(toast), duration);
  };

  const removeToast = (el) => {
    el.style.animation = "cs-slide-out 0.3s ease forwards";
    setTimeout(() => el.remove(), 300);
  };

  /* ─────────────────────────────────
EXTERNAL LINK DETECTION
Fires when a student clicks any
link that leaves this platform.
───────────────────────────────── */
  const initLinkDetection = () => {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link?.href || !isExternalLink(link.href)) return;

      reportActivity({ type: "url", url: link.href });
    });
  };

  /* ─────────────────────────────────
TEXT INPUT DETECTION
Fires when a student types in
any input on the platform.

Skipped fields:
- Passwords (never scanned)
- Forum inputs (cs-text, cs-name)
which have their own full
blocking scan inside forum.html
───────────────────────────────── */
  const initInputDetection = () => {
    const SKIP_IDS = new Set(["cs-text", "cs-name", "cs-textarea"]);

    const handler = debounce((e) => {
      const val = e.target?.value?.trim();
      if (!val || val.length < CONFIG.minTextLength) return;
      if (e.target.type === "password") return;
      if (SKIP_IDS.has(e.target.id)) return;

      reportActivity({ type: "text", text: val });
    }, CONFIG.debounceMs);

    document.addEventListener("input", handler);
  };

  /* ─────────────────────────────────
BOOT
───────────────────────────────── */
  const init = () => {
    initLinkDetection();
    initInputDetection();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
