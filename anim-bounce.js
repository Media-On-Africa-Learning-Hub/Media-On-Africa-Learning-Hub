// anim-bounce.js
// Drives the floating bubbles/icons with real position + velocity,
// bouncing them off the viewport edges AND the live on-screen bounding
// box of every .quiz-card — something CSS keyframes can never do, since
// keyframes have no way to know where the cards actually are.
//
// Each particle keeps its CSS-defined spot (set in quizzes.css) as an
// "anchor" — we read that once via getBoundingClientRect(), then apply
// `transform: translate(dx, dy)` on top of it every frame. The anchor
// itself never moves; only the translate offset does.

document.addEventListener("DOMContentLoaded", () => {
  const decor = document.querySelector(".quiz-decor");
  if (!decor) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) return; // leave everything at its static anchor

  const elements = Array.from(decor.querySelectorAll(".bubble, .float-icon"));
  if (elements.length === 0) return;

  // Which elements to bounce off of is declared per-page via
  // data-bounce-target on the .quiz-decor container itself (e.g.
  // ".quiz-card" on quizzes.html, "#subjectsApp" on Subjects.html).
  // Falls back to ".quiz-card" if the attribute is ever missing.
  const bounceTargetSelector = decor.dataset.bounceTarget || ".quiz-card";

  const particles = elements.map((el) => {
    const rect = el.getBoundingClientRect();
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 50; // px/second
    return {
      el,
      anchorX: rect.left,
      anchorY: rect.top,
      width: rect.width,
      height: rect.height,
      dx: 0,
      dy: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
  });

  let lastTime = null;

  function isDecorVisible() {
    return getComputedStyle(decor).display !== "none";
  }

  function step(timestamp) {
    if (lastTime === null) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // clamp for tab-switch jumps
    lastTime = timestamp;

    if (isDecorVisible()) {
      const cardRects = Array.from(
        document.querySelectorAll(bounceTargetSelector),
      ).map((card) => card.getBoundingClientRect());

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      particles.forEach((p) => {
        p.dx += p.vx * dt;
        p.dy += p.vy * dt;

        let x = p.anchorX + p.dx;
        let y = p.anchorY + p.dy;

        // Bounce off viewport edges
        if (x < 0) {
          x = 0;
          p.dx = x - p.anchorX;
          p.vx = Math.abs(p.vx);
        } else if (x + p.width > vw) {
          x = vw - p.width;
          p.dx = x - p.anchorX;
          p.vx = -Math.abs(p.vx);
        }

        if (y < 0) {
          y = 0;
          p.dy = y - p.anchorY;
          p.vy = Math.abs(p.vy);
        } else if (y + p.height > vh) {
          y = vh - p.height;
          p.dy = y - p.anchorY;
          p.vy = -Math.abs(p.vy);
        }

        // Bounce off any quiz card currently on screen
        for (const card of cardRects) {
          const overlapping =
            x < card.right &&
            x + p.width > card.left &&
            y < card.bottom &&
            y + p.height > card.top;

          if (!overlapping) continue;

          // Push out along whichever axis has the smaller overlap, so it
          // reads as hitting that edge rather than teleporting.
          const overlapLeft = x + p.width - card.left;
          const overlapRight = card.right - x;
          const overlapTop = y + p.height - card.top;
          const overlapBottom = card.bottom - y;
          const minOverlap = Math.min(
            overlapLeft,
            overlapRight,
            overlapTop,
            overlapBottom,
          );

          if (minOverlap === overlapLeft) {
            x = card.left - p.width;
            p.vx = -Math.abs(p.vx);
          } else if (minOverlap === overlapRight) {
            x = card.right;
            p.vx = Math.abs(p.vx);
          } else if (minOverlap === overlapTop) {
            y = card.top - p.height;
            p.vy = -Math.abs(p.vy);
          } else {
            y = card.bottom;
            p.vy = Math.abs(p.vy);
          }

          p.dx = x - p.anchorX;
          p.dy = y - p.anchorY;
        }

        p.el.style.transform = `translate(${p.dx}px, ${p.dy}px)`;
      });
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

  // Re-anchor on resize, since gutter positions (left/right %, top %) shift
  // with viewport size — without this, particles would drift relative to
  // their intended side after a resize.
  window.addEventListener("resize", () => {
    particles.forEach((p) => {
      p.el.style.transform = "none";
      const rect = p.el.getBoundingClientRect();
      p.anchorX = rect.left;
      p.anchorY = rect.top;
      p.dx = 0;
      p.dy = 0;
    });
  });
});