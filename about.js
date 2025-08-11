// About Page JavaScript (Simplified Fetch Version)

document.addEventListener('DOMContentLoaded', function() {
  console.log('About page loaded');

  // Replace this URL with your deployed Apps Script endpoint
  const ABOUT_API_URL = 'https://script.google.com/macros/s/AKfycbzQeunzlj6NL-INBKNA-P-jZLnygG-r6wO53tykV2tVnQ6WdbkFB9EpjCtR8f5n7Vs/exec'; // <-- Replace with your about script URL

  // No IndexedDB usage — About always fetched fresh

  const aboutCard = document.querySelector('.about-card');
  const originalCardHTML = aboutCard.innerHTML; // Store original structure for restoration

  // Read current language from localStorage (default FR)
  function getCurrentLang() {
    try {
      const v = localStorage.getItem('ospv_language');
      return (v === 'EN' || v === 'FR') ? v : 'FR';
    } catch (_) { return 'FR'; }
  }

  // Keep last loaded About payload to support live re-render on language change
  let lastAboutData = null;

  function showLoading() {
    aboutCard.innerHTML = `
      <div class="about-loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement...</p>
      </div>
    `;
  }

  function showError() {
    aboutCard.innerHTML = `
      <div class="about-error">
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger les informations pour le moment.</p>
        </div>
      </div>
    `;
  }

  function renderAboutContent(aboutData) {
    if (!aboutData) return;
    lastAboutData = aboutData;
    // Restore the original card structure
    aboutCard.innerHTML = originalCardHTML;
    
    // Update elements with new data
    const aboutImage = document.getElementById('about-image');
    const aboutTitle = document.getElementById('about-title');
    const aboutText = document.getElementById('about-text');
    const socialLinks = document.querySelector('.about-social-links');

    if (aboutData.about_image) aboutImage.src = aboutData.about_image;
    
    const lang = getCurrentLang();
    const title = lang === 'EN' ? (aboutData.about_title_EN || aboutData.about_title_FR || '')
                                : (aboutData.about_title_FR || aboutData.about_title_EN || '');
    const text  = lang === 'EN' ? (aboutData.about_text_EN || aboutData.about_text_FR || '')
                                : (aboutData.about_text_FR || aboutData.about_text_EN || '');
    if (title && aboutTitle) aboutTitle.textContent = title;
    if (text && aboutText) aboutText.textContent = text;
    
    // Update social links if they exist in the data
    if (aboutData.instagram_url) {
      const instaLink = socialLinks.querySelector('.fa-instagram').closest('a');
      if (instaLink) instaLink.href = aboutData.instagram_url;
    }
    
    if (aboutData['x(twitter)_url']) {
      const twitterLink = socialLinks.querySelector('.fa-x-twitter').closest('a');
      if (twitterLink) twitterLink.href = aboutData['x(twitter)_url'];
    }
    
    if (aboutData.tiktok_url) {
      const tiktokLink = socialLinks.querySelector('.fa-tiktok').closest('a');
      if (tiktokLink) tiktokLink.href = aboutData.tiktok_url;
    }
  }

  // Fetch About from network and render
  async function fetchAboutAndRender() {
    try {
      try { console.log('[About][Fetch] starting', { url: ABOUT_API_URL }); } catch(_) {}
      const resp = await fetch(ABOUT_API_URL, { cache: 'no-store', keepalive: true });
      if (!resp.ok) throw new Error('About fetch failed: ' + resp.status);
      const data = await resp.json();
      if (data && (data.about_title_EN || data.about_title_FR)) {
        renderAboutContent(data);
      } else {
        showError();
      }
    } catch (e) {
      console.error('About network fetch failed:', e);
      showError();
    }
  }

  // Add loading animation
  window.addEventListener('load', function() {
    document.body.style.opacity = '1';
  });
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease-in-out';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);

  // Start logic: always fetch fresh from network
  (async () => {
    try {
      showLoading();
      await fetchAboutAndRender();
    } catch (e) {
      console.warn('About load error:', e);
      showError();
    }
  })();

  // React to language changes from the navbar
  window.addEventListener('ospv:languageChanged', function() {
    if (lastAboutData) {
      renderAboutContent(lastAboutData);
    }
  });
});