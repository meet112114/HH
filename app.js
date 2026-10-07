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

  discoverDriveImages('versova-drive01/slide-images', 1).then(imageNames => {
    initializeDriveGallery({
      directory: 'versova-drive01/slide-images',
      imageNames,
      trackId: 'galleryTrack',
      previousButtonId: 'galleryPrev',
      nextButtonId: 'galleryNext',
      label: 'Versova Beach clean-up'
    });
  });
  initializeDriveGallery({
    directory: 'versova-drive02/slide-images',
    imageNames: ['0.1.jpeg', '0.jpeg', '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg', '7.jpeg', '8.jpeg', '9.jpeg', '10.jpeg', '11.jpeg'],
    trackId: 'galleryTrack02',
    previousButtonId: 'galleryPrev02',
    nextButtonId: 'galleryNext02',
    label: 'Versova Drive 02 clean-up'
  });
  initializeCertificateSearch();
});

const supportedImageExtensions = ['jpeg', 'jpg', 'png', 'webp'];

function imageExists(imagePath) {
  return new Promise(resolve => {
    const probe = new Image();
    probe.onload = () => resolve(true);
    probe.onerror = () => resolve(false);
    probe.src = `${imagePath}?check=${Date.now()}`;
  });
}

async function discoverDriveImages(directory, firstImageNumber) {
  const imageNames = [];

  for (let imageNumber = firstImageNumber; imageNumber <= 200; imageNumber += 1) {
    let imagePath = null;

    for (const extension of supportedImageExtensions) {
      const candidatePath = `${directory}/${imageNumber}.${extension}`;
      if (await imageExists(candidatePath)) {
        imagePath = `${imageNumber}.${extension}`;
        break;
      }
    }

    if (!imagePath) break;
    imageNames.push(imagePath);
  }

  return imageNames;
}

function initializeDriveGallery({ directory, imageNames, trackId, previousButtonId, nextButtonId, label }) {
  const track = document.getElementById(trackId);
  const previousButton = document.getElementById(previousButtonId);
  const nextButton = document.getElementById(nextButtonId);

  if (!track || !previousButton || !nextButton) return;

  const imagePath = imageName => `${directory}/${imageName}`;
  let currentImage = 0;

  if (!imageNames.length) return;

  track.innerHTML = `
    <figure class="gallery-slide">
      <img class="gallery-image is-active" src="${imagePath(imageNames[0])}" alt="${label} moment 1">
      <img class="gallery-image" src="${imagePath(imageNames[1] || imageNames[0])}" alt="${label} moment 2" aria-hidden="true">
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
      nextImage.alt = `${label} moment ${nextImageIndex + 1}`;
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

// Shared certificate search across every completed drive.
const certificateDrives = [
  {
    number: '01',
    name: 'Versova Beach Clean-up Drive',
    date: '06 September 2026',
    directory: 'versova-drive01/certificates',
    files: [
  'AAMIR KHAN.jpg',
  'AAYUSH PEDNEKAR.jpg',
  'ABHISHEK CHOUDHARY.jpg',
  'ABHISHEK PANDEY.jpg',
  'ADITI CHAUBEY.jpg',
  'AKHIL SINGH RAJPUT.jpg',
  'AKSHAY MANORE.jpg',
  'AMAAN SHAIKH.jpg',
  'ANISH BHOSALE.jpg',
  'ANURAG PRAJAPATI.jpg',
  'BIGNESH RAWAL.jpg',
  'BINDHYA KARKERA.jpg',
  'BIPIN GUPTA.jpg',
  'CHAITANNYA KHOT.jpg',
  'DEBARGHYA MAJUMDER.jpg',
  'DEBASISH BEHERA.jpg',
  'DEEPIKA ARGADE.jpg',
  'DEVIKA SHARMA.jpg',
  'DHAIRYA KAMBLE.jpg',
  'DHRUV BORSE.jpg',
  'DIYA MANDAL.jpg',
  'HARSHDEEP SINGH.jpg',
  'JAYSHREE SINGH.jpg',
  'JEZIL AWARI.jpg',
  'JITENDRA SINGH RAJPUT.jpg',
  'KAUSHAL KUNDEKAR.jpg',
  'KAUSHIK LOKARE.jpg',
  'KEVEN SHARON.jpg',
  'KUSH MODHA.jpg',
  'LOKESH PATIL.jpg',
  'MANAN DOSHI.jpg',
  'MANTHAN VILANKAR.jpg',
  'MEET SANWAWADKAR.jpg',
  'MONALI SAWANT.jpg',
  'PRANAV KAMBLE.jpg',
  'RHUTVIK KADAM.jpg',
  'SAHIL DESAI.jpg',
  'SAHIL PATIL.jpg',
  'SAI NEWALKAR.jpg',
  'SAKSHI SONDKAR.jpg',
  'SANDHESH PANMAND.jpg',
  'SARASWATI ORAON.jpg',
  'SHREYA SONAWANE.jpg',
  'SIDDHARTH KANIM.jpg',
  'SOHAN CHOUDHARY.jpg',
  'SURAJ KONDEKAR.jpg',
  'VAIBHAV SINGH.jpg',
  'VIGHNESH NAKATE.jpg',
  'VINIT VERMA.jpg',
      'YASHRAJ DESHMUKH.jpg'
    ]
  },
  {
    number: '02',
    name: 'Post-Ganpati Versova Beach Clean-up',
    date: '04 October 2026',
    directory: 'versova-drive02/certificates',
    files: [
      'AADESH TIWARI.jpg',
      'ABHISHEK PANDEY.jpg',
      'AKHIL SINGH.jpg',
      'AKSHATA BHATKAR.jpg',
      'ANURAG PRAJAPATI.jpg',
      'ARYAN KENI.jpg',
      'ASHMIR SHAIKH.jpg',
      'ATHARVA SAWARDEKAR.jpg',
      'AVISHKAR JADHAV.jpg',
      'BIGNESH RAWAL.jpg',
      'BINDHYA KARKERA.jpg',
      'CHAITANNYA KHOT.jpg',
      'DANISH SHAH.jpg',
      'DEBARGHAYA MAJUMDER.jpg',
      'DHAIRYA KAMBLE.jpg',
      'DHANASHREE SHELKE.jpg',
      'DHRUV KHATRI.jpg',
      'GAURAV SAVARATKAR.jpg',
      'HARSHDEEP SINGH.jpg',
      'HITESH BHARDA.jpg',
      'JAY PATIL.jpg',
      'JITENDRA SINGH.jpg',
      'KAUSHIK LOKARE.jpg',
      'KEVEN SHARON.jpg',
      'KUSH MODHA.jpg',
      'LAXMAN INGLE.jpg',
      'MANAN DOSHI.jpg',
      'MANTHAN VILANKAR.jpg',
      'MEET SANWADKAR.jpg',
      'MONALI SAWANT.jpg',
      'NITHIN GELLE.jpg',
      'OMKAR DHEMBRE.jpg',
      'OMKAR PRABHU.jpg',
      'PARAM BHOSLE.jpg',
      'PRANAV KAMBLE.jpg',
      'PRANIT LAD.jpg',
      'PRIYASHA PATIL.jpg',
      'RAGHAV PITHADIA.jpg',
      'RASHMI PATIL.jpg',
      'RHUTVIK KADAM.jpg',
      'RIA GAWDE.jpg',
      'RITU SURYAWANSHI.jpg',
      'RUCHIKA SURVE.jpg',
      'SAHIL HAWALDAR.jpg',
      'SAHIL PATIL.jpg',
      'SAHIL RANE.jpg',
      'SAI NEWALKAR.jpg',
      'SAKSHI PATIL.jpg',
      'SAKSHI SONDKAR.jpg',
      'SANDESH PANMAND.jpg',
      'SARASWATI ORAON.jpg',
      'SHRAVAN MASKAR.jpg',
      'SHRAVANI KHOLE.jpg',
      'SHRAVANI PATIL.jpg',
      'SHREYA SONAWANE.jpg',
      'SHREYASH PAIKRAO.jpg',
      'SHRUTI SARVADE.jpg',
      'SHUBHAM KADAM.jpg',
      'SIDDHARTH KADAM.jpg',
      'SIDDHI ANDHARE.jpg',
      'SNEHA SHINDE.jpg',
      'SNEHIL KAMBLE.jpg',
      'SOHAM BAPAT.jpg',
      'SOHAN CHAUDHARY.jpg',
      'SOHAN PATIL.jpg',
      'SOUMYA SHETTY.jpg',
      'SRAWANI BELDAR.jpg',
      'SRUSHTI LANDE.jpg',
      'SUMAN PANIGRAHY.jpg',
      'SUMIT DUBEY.jpg',
      'SURAJ KONDEKAR.jpg',
      'TANUJA PATIL.jpg',
      'TANVI RAJDEO.jpg',
      'THUSHAR POOJARY.jpg',
      'TRIVENI KATKAR.jpg',
      'TWINKLE SHARMA.jpg',
      'VAIDEHI SATHE.jpg',
      'VAISHNAVI BHAKAD.jpg',
      'VED KADAM.jpg',
      'VIGHNESH NAKATE.jpg',
      'VINT VERMA.jpg',
      'YASH DUBAL.jpg',
      'YASHRAJ DESHMUKH.jpg'
    ]
  }
];

function initializeCertificateSearch() {
  const searchInput = document.getElementById('certificateSearchInput');
  const searchBtn = document.getElementById('certificateSearchBtn');
  const resultsContainer = document.getElementById('certificateResults');

  if (!searchInput || !searchBtn || !resultsContainer) return;

  // Search on button click
  searchBtn.addEventListener('click', () => performCertificateSearch());

  // Search on Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performCertificateSearch();
    }
  });

  // Clear results when input is cleared
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      resultsContainer.innerHTML = '';
    }
  });
}

function performCertificateSearch() {
  const searchInput = document.getElementById('certificateSearchInput');
  const resultsContainer = document.getElementById('certificateResults');

  if (!searchInput || !resultsContainer) return;

  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
    showToast('Please enter a name to search');
    return;
  }

  const normalizedSearchTerm = searchTerm.toUpperCase().replace(/\s+/g, ' ');
  const matches = certificateDrives.flatMap(drive => drive.files
    .filter(file => file.replace(/\.[^.]+$/, '').toUpperCase().includes(normalizedSearchTerm))
    .map(file => ({ ...drive, file })));

  displayCertificateResults(matches);
}

function displayCertificateResults(matches) {
  const resultsContainer = document.getElementById('certificateResults');
  const template = document.getElementById('certificateResultTemplate');

  if (!resultsContainer || !template) return;

  resultsContainer.innerHTML = '';

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <div class="certificate-no-results">
        <p>No certificate found for this name. Try a different spelling or check your name in the participant list.</p>
      </div>
    `;
    return;
  }

  matches.forEach(({ number, date, directory, file }) => {
    const clone = template.content.cloneNode(true);
    const resultItem = clone.querySelector('.certificate-result-item');
    const nameElement = clone.querySelector('.certificate-result-name');
    const detailsElement = clone.querySelector('.certificate-result-text');
    const viewBtn = clone.querySelector('.certificate-view-btn');
    const downloadBtn = clone.querySelector('.certificate-download-btn');

    if (resultItem && nameElement && detailsElement && viewBtn && downloadBtn) {
      const displayName = file.replace(/\.[^.]+$/, '');
      const certificateUrl = `${directory}/${encodeURIComponent(file)}`;
      nameElement.textContent = displayName;
      detailsElement.textContent = `Drive ${number} · ${date.replace('September', 'Sep').replace('October', 'Oct')}`;
      viewBtn.href = certificateUrl;
      downloadBtn.href = certificateUrl;
      downloadBtn.download = file;
    }

    resultsContainer.appendChild(clone);
  });

  // Reinitialize Lucide icons for the new elements
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
