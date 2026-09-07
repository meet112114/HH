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

  discoverDriveImages().then(initializeDriveGallery);
});

const driveImages = {};
const driveImageDirectory = 'versova-drive01/slide-images';
const supportedImageExtensions = ['jpeg', 'jpg', 'png', 'webp'];

function imageExists(imagePath) {
  return new Promise(resolve => {
    const probe = new Image();
    probe.onload = () => resolve(true);
    probe.onerror = () => resolve(false);
    probe.src = `${imagePath}?check=${Date.now()}`;
  });
}

async function discoverDriveImages() {
  for (let imageNumber = 1; imageNumber <= 200; imageNumber += 1) {
    let imagePath = null;

    for (const extension of supportedImageExtensions) {
      const candidatePath = `${driveImageDirectory}/${imageNumber}.${extension}`;
      if (await imageExists(candidatePath)) {
        imagePath = `${imageNumber}.${extension}`;
        break;
      }
    }

    if (!imagePath) break;
    driveImages[`photo${String(imageNumber).padStart(2, '0')}`] = imagePath;
  }
}

function initializeDriveGallery() {
  const track = document.getElementById('galleryTrack');
  const previousButton = document.getElementById('galleryPrev');
  const nextButton = document.getElementById('galleryNext');

  if (!track || !previousButton || !nextButton) return;

  const imagePath = imageName => `${driveImageDirectory}/${imageName}`;
  const imageNames = Object.values(driveImages);
  let currentImage = 0;

  if (!imageNames.length) return;

  track.innerHTML = `
    <figure class="gallery-slide">
      <img class="gallery-image is-active" src="${imagePath(imageNames[0])}" alt="Versova Beach clean-up moment 1">
      <img class="gallery-image" src="${imagePath(imageNames[1] || imageNames[0])}" alt="Versova Beach clean-up moment 2" aria-hidden="true">
      <figcaption>01 / ${String(imageNames.length).padStart(2, '0')}</figcaption>
    </figure>
  `;

  const slide = track.querySelector('.gallery-slide');
  const images = slide?.querySelectorAll('.gallery-image');
  const caption = slide?.querySelector('figcaption');

  if (!slide || !images || images.length !== 2 || !caption) return;

  slide.classList.add('is-visible');

  const showImage = direction => {
    const nextImageIndex = (currentImage + direction + imageNames.length) % imageNames.length;
    const activeImage = slide.querySelector('.gallery-image.is-active');
    const nextImage = [...images].find(candidate => candidate !== activeImage);
    if (!activeImage || !nextImage || nextImage.dataset.loading === 'true') return;

    nextImage.dataset.loading = 'true';
    const preload = new Image();
    preload.onload = () => {
      nextImage.src = preload.src;
      nextImage.alt = `Versova Beach clean-up moment ${nextImageIndex + 1}`;
      nextImage.classList.add('is-active');
      activeImage.classList.remove('is-active');
      nextImage.dataset.loading = 'false';
      currentImage = nextImageIndex;
      caption.textContent = `${String(currentImage + 1).padStart(2, '0')} / ${String(imageNames.length).padStart(2, '0')}`;
    };
    preload.src = imagePath(imageNames[nextImageIndex]);
  };

  previousButton.addEventListener('click', () => showImage(-1));
  nextButton.addEventListener('click', () => showImage(1));
}

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
