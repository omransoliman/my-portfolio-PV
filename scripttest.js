// Toggle menu function
function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('active');
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
    const isEnglish = currentLang === 'EN'; // Check if the current language is English
    const newLanguage = isEnglish ? 'fr' : 'en'; // Toggle the language
    console.log('New language:', newLanguage);

    // Save the selected language to localStorage
    localStorage.setItem('language', newLanguage);
    console.log('Language saved to localStorage:', newLanguage);

    // Update the UI based on the selected language
    updateUI(newLanguage);

    // Update the language switch button text
    languageSwitch.textContent = newLanguage === 'en' ? 'FR' : 'EN';
    console.log('Language switch button text updated to:', languageSwitch.textContent);
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
    if (languageSwitch) {
        languageSwitch.textContent = isEnglish ? 'FR' : 'EN';
    } else {
        console.error('Language switch element not found in the DOM.');
    }

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

    // Portfolio section titles (only if the element exists)
    const portfolioTitle = document.querySelector('#portfolio h2');
    if (portfolioTitle) {
        portfolioTitle.textContent = isEnglish 
            ? config.translations.en.menu.portfolio 
            : config.translations.fr.menu.portfolio;
    } else {
        console.log('Portfolio section not found on this page.'); // Optional: Log a message if the element is missing
    }

    // Portfolio item titles (only if the elements exist)
    const portfolioItems = document.querySelectorAll('.portfolio-item .portfolio-title');
    if (portfolioItems.length > 0) {
        portfolioItems.forEach((item, index) => {
            const titles = isEnglish 
                ? [config.translations.en.menu.wedding, config.translations.en.menu.engagement, config.translations.en.menu.portrait]
                : [config.translations.fr.menu.wedding, config.translations.fr.menu.engagement, config.translations.fr.menu.portrait];

            item.textContent = titles[index];
        });
    } else {
        console.log('Portfolio items not found on this page.'); // Optional: Log a message if the elements are missing
    }
}

// Function to load the PicFlow script
function loadPicFlowScript() {
    const picflowGalleryElement = document.querySelector('picflow-gallery');

    if (picflowGalleryElement) {
        console.log('PicFlow gallery element found. Loading script...');
        
        const script = document.createElement('script');
        script.src = 'https://picflow.com/embed/main.js';
        script.type = 'module';
        script.defer = true;

        script.onload = () => {
            console.log('PicFlow script loaded successfully.');
        };

        script.onerror = () => {
            console.error('Failed to load PicFlow script.');
        };

        document.head.appendChild(script);
    } else {
        console.log('PicFlow gallery element not found. Skipping script load.');
    }
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
        languageSwitch.textContent = savedLanguage === 'en' ? 'EN' : 'FR';
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

        console.log('Gallery ID :', galleryId); 
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