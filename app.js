// ==========================================================
// Helping Hands - Static Website & Contact Form Logic
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Mobile Navigation Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
});

// Contact Form Handler
function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('contactSuccessMsg');
  const name = document.getElementById('contactName')?.value || 'Friend';

  if (form && successBox) {
    form.classList.add('hidden');
    successBox.classList.remove('hidden');

    showToast(`Thank you, ${name}! Your message has been sent to Helping Hands. 🌱`);
  }
}

// Toast Helper
function showToast(message) {
  const container = document.getElementById('toastBox');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
