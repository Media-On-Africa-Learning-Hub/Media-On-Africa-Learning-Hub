// Shared offline/online banner toggle.
// Requires a <div id="moa-offline-banner">…</div> in the page body
// (styled by #moa-offline-banner in styles.css). Include this file on any
// page that shows the banner, instead of duplicating this logic inline.
(function () {
  var banner = document.getElementById("moa-offline-banner");
  if (!banner) return;

  function updateBanner() {
    if (!navigator.onLine) {
      banner.style.display = "block";
      banner.classList.remove("online");
    } else {
      banner.classList.add("online");
      banner.style.display = "block";
      setTimeout(function () {
        banner.style.display = "none";
      }, 3000);
    }
  }

  window.addEventListener("online", updateBanner);
  window.addEventListener("offline", updateBanner);
  if (!navigator.onLine) updateBanner();
})();