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

const FORM_ENDPOINT = 'https://formspree.io/f/xkjnwwka';

// Contact Form Handler
function handleContactSubmit(e) {
  e.preventDefault();

  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('contactSuccessMsg');

  if (!form || !successBox) return;

  const name = document.getElementById('contactName')?.value?.trim() || 'Friend';

  fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: new FormData(form)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      return response.json();
    })
    .then(() => {
      form.classList.add('hidden');
      successBox.classList.remove('hidden');
      showToast(`Thank you, ${name}! Your message has been sent to Helping Hands. 🌱`);
    })
    .catch(() => {
      showToast('There was a problem sending your message. Please configure your Formspree form endpoint and retry.');
    });
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
