// Toggle menu function
function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('active');
}

// Language toggle function
function toggleLanguage() {
    const lang = document.querySelector('.language-switch').textContent.trim();
    const isEnglish = lang === 'EN'; // Check if the current language is English

    // Save the selected language to localStorage
    const selectedLanguage = isEnglish ? 'fr' : 'en';
    localStorage.setItem('language', selectedLanguage);

    // Update the UI based on the selected language
    updateUI(selectedLanguage);
}

// Update the UI based on the selected language
function updateUI(language) {
    const isEnglish = language === 'en';

    // Translate menu and other elements
    const elements = document.querySelectorAll('[data-fr][data-en]');
    elements.forEach(el => {
        el.textContent = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-fr');
    });

    // Translate dropdown menu
    const dropdownTrigger = document.querySelector('.dropdown > a');
    dropdownTrigger.textContent = isEnglish 
        ? config.translations.en.menu.portfolio 
        : config.translations.fr.menu.portfolio;

    // Translate portfolio dropdown items if needed
    const dropdownItems = document.querySelectorAll('.dropdown-content a');
    dropdownItems.forEach((item, index) => {
        const categories = isEnglish 
            ? [config.translations.en.menu.wedding, config.translations.en.menu.engagement, config.translations.en.menu.portrait]
            : [config.translations.fr.menu.wedding, config.translations.fr.menu.engagement, config.translations.fr.menu.portrait];

        item.textContent = categories[index];
    });

    // Toggle language switch text
    const languageSwitch = document.querySelector('.language-switch');
    languageSwitch.textContent = isEnglish ? 'FR' : 'EN';

    // Update About section
    const aboutTitle = document.getElementById('about-title');
    const aboutDescription = document.getElementById('about-description');
    const contactButton = document.getElementById('contact-btn-text');
    const aboutImage = document.getElementById('about-image');

    if (aboutTitle && aboutDescription && contactButton && aboutImage) {
        aboutTitle.textContent = isEnglish 
            ? config.translations.en.about.title 
            : config.translations.fr.about.title;
        aboutDescription.textContent = isEnglish 
            ? config.translations.en.about.description 
            : config.translations.fr.about.description;
        contactButton.textContent = isEnglish 
            ? config.translations.en.about.contactButton 
            : config.translations.fr.about.contactButton;
        aboutImage.src = isEnglish 
            ? config.translations.en.about.image 
            : config.translations.fr.about.image;
    } else {
        console.error("One or more About section elements not found in the DOM.");
    }

    // Portfolio section titles
    const portfolioTitle = document.querySelector('#portfolio h2');
    portfolioTitle.textContent = isEnglish 
        ? config.translations.en.menu.portfolio 
        : config.translations.fr.menu.portfolio;

    // Portfolio item titles
    const portfolioItems = document.querySelectorAll('.portfolio-item .portfolio-title');
    portfolioItems.forEach((item, index) => {
        const titles = isEnglish 
            ? [config.translations.en.menu.wedding, config.translations.en.menu.engagement, config.translations.en.menu.portrait]
            : [config.translations.fr.menu.wedding, config.translations.fr.menu.engagement, config.translations.fr.menu.portrait];

        item.textContent = titles[index];
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Get the saved language preference from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default to English if no preference is saved

    // Update the UI based on the saved language
    updateUI(savedLanguage);

    // Set the language switch button text
    const languageSwitch = document.querySelector('.language-switch');
    languageSwitch.textContent = savedLanguage === 'en' ? 'FR' : 'EN';

    // Initialize Picflow Gallery
    const picflowGalleryElement = document.querySelector('picflow-gallery');

    if (picflowGalleryElement) {
        // Get the gallery ID from the data attribute
        const galleryIdKey = picflowGalleryElement.getAttribute('data-gallery-id');

        // Get the corresponding gallery ID from config.js
        const galleryId = config.picflowGalleryIds[galleryIdKey];

        if (galleryId) {
            picflowGalleryElement.setAttribute('id', galleryId);
        } else {
            console.error(`Gallery ID not found for key: ${galleryIdKey}`);
        }
    }

    // Initialize Home Page Slideshow
    const homeSection = document.getElementById('home');
    if (homeSection && config.homeSlideshow?.images?.length > 0) {
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

        changeSlide(); // Initial image
        setInterval(changeSlide, interval + 1000);
    }

    // Initialize EmailJS
    (function(){
        emailjs.init("E-RvIRcSZ7GCz-Yz_");
    })();

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            emailjs.sendForm('service_kt9zzgp', 'template_xychznp', this)
                .then(function(response) {
                    alert('Message sent successfully!');
                }, function(error) {
                    alert('Failed to send message: ' + JSON.stringify(error));
                });
        });
    }
});

// Create a new script element
const script = document.createElement('script');

// Set the script attributes
script.src = 'https://picflow.com/embed/main.js';
script.type = 'module';
script.defer = true;

// Append the script to the document's head or body
document.head.appendChild(script); // or document.body.appendChild(script);