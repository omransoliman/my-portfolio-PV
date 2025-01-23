function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('active');
}
// Language toggle function (reused from index.html)
function toggleLanguage() {
const lang = document.querySelector('.language-switch').textContent.trim();
const elements = document.querySelectorAll('[data-fr][data-en]');
const isEnglish = lang === 'EN'; // Fix check to use 'EN' correctly

elements.forEach(el => {
el.textContent = isEnglish ? el.getAttribute('data-fr') : el.getAttribute('data-en');
});

// Translate dropdown menu
const dropdownTrigger = document.querySelector('.dropdown > a');
dropdownTrigger.textContent = isEnglish 
? config.translations.fr.menu.portfolio 
: config.translations.en.menu.portfolio;

// Translate portfolio dropdown items if needed
const dropdownItems = document.querySelectorAll('.dropdown-content a');
dropdownItems.forEach((item, index) => {
const categories = isEnglish 
    ? [config.translations.fr.menu.wedding, config.translations.fr.menu.engagement, config.translations.fr.menu.portrait]
    : [config.translations.en.menu.wedding, config.translations.en.menu.engagement, config.translations.en.menu.portrait];

item.textContent = categories[index];
});

document.querySelector('.language-switch').textContent = isEnglish ? 'FR' : 'EN'; // Toggle between 'EN' and 'FR'
}

// Initial load to ensure the correct language is set
document.addEventListener('DOMContentLoaded', () => {
toggleLanguage(); // Default to English
});

document.addEventListener('DOMContentLoaded', function() {
    if (typeof config !== 'undefined' && config.picflowGalleryIds) {
        // Extract the page name from the URL path
        const pageName = window.location.pathname.split('/').pop().replace('.html', '');

        // Get the corresponding gallery ID from config.js
        const galleryId = config.picflowGalleryIds[pageName];
        const picflowGalleryElement = document.querySelector('picflow-gallery');

        // If the element and gallery ID are found, set the gallery ID dynamically
        if (picflowGalleryElement && galleryId) {
            picflowGalleryElement.setAttribute('id', galleryId);
        }
    }
});

// Embed Picflow Portrait Gallery 
if (!window.picflow) {
    window.picflow = true;
    var s = document.createElement("script");
    s.src = "https://picflow.com/embed/main.js";
    s.type = "module";
    s.defer = true;
    document.head.appendChild(s);
  }