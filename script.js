// Constants
const LANGUAGES = {
    en: 'EN',
    fr: 'FR',
};

// Toggle menu function
function toggleMenu() {
    const menu = document.querySelector('.menu');
    if (menu) {
        menu.classList.toggle('active');
    } else {
        console.error('Menu element not found.');
    }
}

// Language toggle function
function toggleLanguage() {
    const languageSwitch = document.querySelector('.language-switch');
    if (!languageSwitch) {
        console.error('Language switch button not found.');
        return;
    }

    // Get the current language from the button text
    const currentLang = languageSwitch.textContent.trim();
    console.log('Current language switch text:', currentLang);

    // Determine the new language
    const isEnglish = currentLang === LANGUAGES.en; // Check if the current language is English
    const newLanguage = isEnglish ? 'fr' : 'en'; // Toggle the language
    console.log('New language:', newLanguage);

    // Save the selected language to localStorage
    localStorage.setItem('language', newLanguage);
    console.log('Language saved to localStorage:', newLanguage);

    // Update the UI based on the selected language
    updateUI(newLanguage);

    // Update the language switch button text
    languageSwitch.textContent = newLanguage === 'en' ? LANGUAGES.en : LANGUAGES.fr; // Fixed logic
    console.log('Language switch button text updated to:', languageSwitch.textContent);
}

// Update the About section
function updateAboutSection(isEnglish) {
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
}

// Update the Portfolio section
function updatePortfolioSection(isEnglish) {
    const portfolioTitle = document.querySelector('#portfolio h2');
    if (portfolioTitle) {
        portfolioTitle.textContent = isEnglish 
            ? config.translations.en.menu.portfolio 
            : config.translations.fr.menu.portfolio;
    } else {
        console.log('Portfolio section not found on this page.');
    }

    const portfolioItems = document.querySelectorAll('.portfolio-item .portfolio-title');
    if (portfolioItems.length > 0) {
        portfolioItems.forEach((item, index) => {
            const titles = isEnglish 
                ? [config.translations.en.menu.wedding, config.translations.en.menu.engagement, config.translations.en.menu.portrait]
                : [config.translations.fr.menu.wedding, config.translations.fr.menu.engagement, config.translations.fr.menu.portrait];

            item.textContent = titles[index];
        });
    } else {
        console.log('Portfolio items not found on this page.');
    }
}

// Update the UI based on the selected language
function updateUI(language) {
    const isEnglish = language === 'en';
    console.log('Updating UI for language:', isEnglish ? 'English' : 'French');

    // Translate menu and other elements
    const elements = document.querySelectorAll('[data-fr][data-en]');
    console.log('Found translatable elements:', elements.length);
    elements.forEach(el => {
        el.textContent = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-fr');
    });

    // Translate dropdown menu
    const dropdownTrigger = document.querySelector('.dropdown > a');
    if (dropdownTrigger) {
        dropdownTrigger.textContent = isEnglish 
            ? config.translations.en.menu.portfolio 
            : config.translations.fr.menu.portfolio;
    } else {
        console.error('Dropdown trigger element not found in the DOM.');
    }

    // Translate portfolio dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-content a');
    dropdownItems.forEach((item, index) => {
        const categories = isEnglish 
            ? [config.translations.en.menu.wedding, config.translations.en.menu.engagement, config.translations.en.menu.portrait]
            : [config.translations.fr.menu.wedding, config.translations.fr.menu.engagement, config.translations.fr.menu.portrait];

        item.textContent = categories[index];
    });

    // Update About section
    updateAboutSection(isEnglish);

    // Update Portfolio section
    updatePortfolioSection(isEnglish);

    // Update Offers section
    updateContent(language);

    // Toggle language switch text
    const languageSwitch = document.querySelector('.language-switch');
    if (languageSwitch) {
        languageSwitch.textContent = isEnglish ? LANGUAGES.fr : LANGUAGES.en;
    } else {
        console.error('Language switch element not found in the DOM.');
    }
}

// Function to load the PicFlow script
function loadPicFlowScript() {
    const picflowGalleryElement = document.querySelector('picflow-gallery');
    if (!picflowGalleryElement || document.querySelector('script[src="https://picflow.com/embed/main.js"]')) {
        console.log('PicFlow gallery element not found or script already loaded.');
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://picflow.com/embed/main.js';
    script.type = 'module';
    script.defer = true;

    script.onload = () => console.log('PicFlow script loaded successfully.');
    script.onerror = () => console.error('Failed to load PicFlow script.');

    document.head.appendChild(script);
}

// Function to create the slideshow
function createSlideshow(images, interval, transitionEffect) {
    const slideshowContainer = document.querySelector('.slideshow-container');

    // Clear any existing content in the slideshow container
    slideshowContainer.innerHTML = '';

    // Load images into the slideshow container
    images.forEach((imageUrl, index) => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Slide ${index + 1}`;
        if (index === 0) img.classList.add('active'); // Set the first image as active
        slideshowContainer.appendChild(img);
    });

    let currentIndex = 0;

    // Function to change the slide
    function changeSlide() {
        const images = slideshowContainer.querySelectorAll('img');
        images[currentIndex].classList.remove('active'); // Hide the current image
        currentIndex = (currentIndex + 1) % images.length; // Move to the next image
        images[currentIndex].classList.add('active'); // Show the next image
    }

    // Start the slideshow
    setInterval(changeSlide, interval);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Get the saved language preference from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default to English if no preference is saved
    console.log('Language retrieved from localStorage:', savedLanguage);

    // Update the UI based on the saved language
    updateUI(savedLanguage);

    // Set the language switch button text
    const languageSwitch = document.querySelector('.language-switch');
    if (languageSwitch) {
        console.log('Language switch button found.');
        languageSwitch.textContent = savedLanguage === 'en' ? LANGUAGES.en : LANGUAGES.fr;
        console.log('Initial language switch button text:', languageSwitch.textContent);

        // Add event listener to the language switch button
        languageSwitch.addEventListener('click', function() {
            console.log('Language switch button clicked.');
            toggleLanguage();
        });
    } else {
        console.error('Language switch button not found.');
    }

    // Initialize Picflow Gallery
    const picflowGalleryElement = document.querySelector('picflow-gallery');
    if (picflowGalleryElement) {
        const galleryIdKey = picflowGalleryElement.getAttribute('data-gallery-id');
        const galleryId = config.picflowGalleryIds[galleryIdKey];

        console.log('Gallery ID:', galleryId); 
        if (galleryId) {
            picflowGalleryElement.setAttribute('id', galleryId);
            console.log('Gallery ID set successfully:', galleryId);
        } else {
            console.error(`Gallery ID not found for key: ${galleryIdKey}`);
        }
    } else {
        console.error('PicFlow gallery element not found in the DOM.');
    }

    // Load the PicFlow script (only if the gallery element exists)
    loadPicFlowScript();

    // Initialize Home Page Slideshow
    // const homeSection = document.getElementById('home');
    // if (homeSection && Array.isArray(config.homeSlideshow?.images) && config.homeSlideshow.images.length > 0) {
    //     const images = config.homeSlideshow.images;
    //     const interval = config.homeSlideshow.interval || 5000;
    //     let currentIndex = 0;

    //     function changeSlide() {
    //         homeSection.classList.add('fade-out');
            
    //         setTimeout(() => {
    //             homeSection.style.backgroundImage = `url('${images[currentIndex]}')`;
    //             homeSection.classList.remove('fade-out');
    //             currentIndex = (currentIndex + 1) % images.length;
    //         }, 1000); // Match the transition time
    //     }

    //     changeSlide(); // Initial image
    //     setInterval(changeSlide, interval + 1000);
    // }
    const { images, interval, transitionEffect } = config.homeSlideshow;
    createSlideshow(images, interval, transitionEffect);

    // Initialize EmailJS
    (function(){
        try {
            emailjs.init("E-RvIRcSZ7GCz-Yz_");
            console.log('EmailJS initialized successfully.');
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    })();

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Basic validation
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();

            if (!name || !email || !message) {
                alert('Please fill out all fields.');
                return;
            }

            emailjs.sendForm('service_kt9zzgp', 'template_xychznp', this)
                .then(function(response) {
                    alert('Message sent successfully!');
                    contactForm.reset(); // Clear the form
                }, function(error) {
                    alert('Failed to send message: ' + JSON.stringify(error));
                });
        });
    }
});