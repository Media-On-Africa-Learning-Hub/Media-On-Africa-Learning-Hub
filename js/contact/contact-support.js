import { db } from "../config/firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* ---------- Firestore Submission Helper ---------- */

export async function sendContactMessage(data) {
  try {
    const docRef = await addDoc(collection(db, "contacts"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Firestore save error:", error);
    return { success: false, error };
  }
}

/* ---------- EmailJS Helper ---------- */

async function sendConfirmationEmail(data) {
  try {
    await emailjs.send('service_xoa649o', 'template_8qtvj6i', {
      user_name: data.name,
      user_email: data.email,
      category: data.category,
      message: data.message
    });
    console.log("Confirmation email sent successfully!");
  } catch (err) {
    console.error("Failed to send email via EmailJS:", err);
  }
}

/* ---------- Form handling ---------- */

async function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const category = document.getElementById("category").value;
  const message = document.getElementById("message").value.trim();
  const submitBtn = event.target.querySelector('button[type="submit"]');

  if (!name || !email || !message) {
    showFormStatus("Please fill in all required fields", "error");
    return;
  }

  if (!email.includes("@")) {
    showFormStatus("Please enter a valid email address", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';

  const data = { name, email, phone, category, message };

  // Dispatch the write to Firestore (it saves locally instantly)
  sendContactMessage(data).catch((err) => {
    console.error("Firestore submission failed:", err);
  });

  // Immediately respond based on network status
  if (navigator.onLine) {
    // Send auto-reply confirmation email via EmailJS
    await sendConfirmationEmail(data);

    showFormStatus("✓ Message sent successfully! We'll get back to you soon.", "success");
    showNotification("Message sent successfully!", "success");
  } else {
    showFormStatus(
      "📡 You're offline. Your message is saved locally and will sync automatically when you reconnect.",
      "info"
    );
    showNotification("Saved offline! Will sync when reconnected.", "success");

    // Queue email trigger for when connection returns
    window.addEventListener('online', async () => {
      await sendConfirmationEmail(data);
      showNotification("Reconnected! Email confirmation sent.", "success");
    }, { once: true });
  }

  // Reset form & restore button immediately
  event.target.reset();
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
}

function showFormStatus(message, type) {
  const formStatus = document.getElementById("formStatus");
  formStatus.textContent = message;
  formStatus.className = `form-status show ${type}`;
  setTimeout(() => formStatus.classList.remove("show"), 5000);
}

function showNotification(message, type = "success") {
  const toast = document.getElementById("notificationToast");
  toast.textContent = message;
  toast.style.background =
    type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

/* ---------- Save page for offline ---------- */

async function downloadPageOffline() {
  const btn = document.getElementById("downloadSupportBtn");
  const originalText = btn.innerHTML;
  btn.innerHTML = "⏳ Downloading...";
  btn.disabled = true;

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const assetsToCache = [
      window.location.href,
      "css/styles.css",
      "css/contact-support.css",
      "js/contact/contact-support.js",
      "js/config/firebase.js",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
    ];

    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_NEW_ASSETS",
      urls: assetsToCache,
    });

    setTimeout(() => {
      btn.innerHTML = "✓ Page Saved!";
      showNotification("Page saved for offline access!", "success");
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
      .then((registration) =>
        console.log("ServiceWorker registered:", registration.scope),
      )
      .catch((error) =>
        console.log("ServiceWorker registration failed:", error),
      );
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  updateOfflineUI();

  const form = document.getElementById("messageForm");
  if (form) form.addEventListener("submit", handleFormSubmit);

  const downloadBtn = document.getElementById("downloadSupportBtn");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadPageOffline);

  const downloadResourcesBtn = document.getElementById("downloadResourcesBtn");
  if (downloadResourcesBtn)
    downloadResourcesBtn.addEventListener("click", downloadPageOffline);

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
        showNotification(
          "Still offline. Please check your connection.",
          "error",
        );
      }
    });
  }
});

window.addEventListener("online", () => {
  updateOfflineUI();
  showNotification("Back online!", "success");
});

window.addEventListener("offline", () => {
  updateOfflineUI();
  showNotification("Offline mode - messages will be saved locally", "info");
});