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

// Update About section
const aboutTitle = document.getElementById('about-title');
const aboutDescription = document.getElementById('about-description');
const contactButton = document.getElementById('contact-btn-text');
const aboutImage = document.getElementById('about-image');

if (aboutTitle && aboutDescription && contactButton && aboutImage) {
    aboutTitle.textContent = isEnglish 
        ? config.translations.fr.about.title 
        : config.translations.en.about.title;
    aboutDescription.textContent = isEnglish 
        ? config.translations.fr.about.description 
        : config.translations.en.about.description;
    contactButton.textContent = isEnglish 
        ? config.translations.fr.about.contactButton 
        : config.translations.en.about.contactButton;
    aboutImage.src = isEnglish 
        ? config.translations.fr.about.image 
        : config.translations.en.about.image;
} else {
    console.error("One or more About section elements not found in the DOM.");
}

// Portfolio section titles
const portfolioTitle = document.querySelector('#portfolio h2');
portfolioTitle.textContent = isEnglish 
    ? config.translations.fr.menu.portfolio 
    : config.translations.en.menu.portfolio;

// Portfolio item titles
const portfolioItems = document.querySelectorAll('.portfolio-item .portfolio-title');
portfolioItems.forEach((item, index) => {
    const titles = isEnglish 
        ? [config.translations.fr.menu.wedding, config.translations.fr.menu.engagement, config.translations.fr.menu.portrait]
        : [config.translations.en.menu.wedding, config.translations.en.menu.engagement, config.translations.en.menu.portrait];
    
    item.textContent = titles[index];
});



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


// Slide show for home page
document.addEventListener('DOMContentLoaded', function() {
    const homeSection = document.getElementById('home');
    const images = config.homeSlideshow.images;
    const interval = config.homeSlideshow.interval || 5000;
    let currentIndex = 0;

    function changeSlide() {
        homeSection.classList.add('fade-out');
        
        setTimeout(() => {
            homeSection.style.backgroundImage = `url('${images[currentIndex]}')`;
            homeSection.classList.remove('fade-out');
            currentIndex = (currentIndex + 1) % images.length;
        }, 1000); // Match the transition time
    }

    if (images && images.length > 0) {
        changeSlide(); // Initial image
        setInterval(changeSlide, interval + 1000);
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

  // EmailJS
  (function(){
    emailjs.init("E-RvIRcSZ7GCz-Yz_");
  })();

  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('service_kt9zzgp', 'template_xychznp', this)
      .then(function(response) {
         alert('Message sent successfully!');
      }, function(error) {
         alert('Failed to send message: ' + JSON.stringify(error));
      });
  });


  // Inject content into the about page
  document.addEventListener("DOMContentLoaded", () => {
    const aboutTitle = document.getElementById("about-title");
    const aboutDescription = document.getElementById("about-description");
    const contactButton = document.getElementById("contact-btn-text");
    const aboutImage = document.getElementById("about-image");
  
    if (aboutTitle && aboutDescription && contactButton && aboutImage) {
      aboutTitle.textContent = aboutData.title;
      aboutDescription.textContent = aboutData.description;
      contactButton.textContent = aboutData.contactButton;
      aboutImage.src = aboutData.image;
    } else {
      console.error("One or more elements not found in the DOM.");
    }
  });