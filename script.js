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
            const firstName = contactForm.querySelector('[id="firstName"]').value.trim();
            const lastName = contactForm.querySelector('[id="lastName"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();

            // Combine first and last name
            const name = `${firstName} ${lastName}`.trim();

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


























// Set this variable to true or false to control the visibility of offers
const showOffers = true; // Change to `true` to show offers, `false` to hide them

// Configuration object to control the visibility of each offer
const offerVisibility = {
    offer1: true,  // Set to `true` to show Offer 1, `false` to hide it
    offer2: true, // Set to `true` to show Offer 2, `false` to hide it
    offer3: false   // Set to `true` to show Offer 3, `false` to hide it
};

// Language configuration object
const languageConfig = {
    en: {
        noOffersMessage: {
            text: "Thank you for your interest in our services! We're always looking for ways to provide exceptional value to our customers. While we don't have any special offers available at this time, we encourage you to follow us on Instagram to be the first to know about future promotions and exclusive deals.",
            button: "Follow us on Instagram"
        },
        offers: [
            {
                // Offer 1
                title: "📸 Capture Your Special Moments! or 💖 Valentine's Day 💖",
                subtitle: "Limited-Time Photography Offer in Lyon",
                details: [
                    "📸 Enjoy a personalized session lasting 1 hour to 1.5 hours",
                    "✨ A maximum of 40 expertly captured photos, Photos will be received online, and Receive your stunning images within 10 days",
                    "📅 Don't miss out, this offer is available until 15/02/2025",
                    "💶 All of this for just 50 euros"
                ],
                bookNow: "Book Now",
                shareMessage: "Capture your special moments with this exclusive photography offer!",
                whatsappMessage: "Limited-Time Photography Offer! I am pleased to accept this offer. Thank you for this opportunity.",
                emailSubject: "Limited-Time Photography Offer",
                emailBody: "Hello! I am pleased to accept this offer. Thank you for this opportunity."
            },
            {
                // offer 2
                title: "🌙 Special Eid al-Fitr Offer.",
                subtitle: "Limited-Time Offer only for the 3 days of Eid. in Lyon", 
                details: [
                    "📷 45 minutes with a professional photographer.",
                    "📸 35 professionally edited high-resolution images. 🕧 Delivery within 24 hours.",
                    "✨ Perfect for families, couples & individuals.",
                    "💶 All of this for just 50 euros"
                ],
                bookNow: "Book Now",
                shareMessage: "Capture your Eid al-Fitr memories with this exclusive photography offer!",
                whatsappMessage: "Limited-Time Eid al-Fitr Photography Offer! I am pleased to accept this offer. Thank you for this opportunity.",
                emailSubject: "Limited-Time Eid al-Fitr Photography Offer",
                emailBody: "Hello! I am pleased to accept this offer. Thank you for this opportunity."
            },
            {
                // Offer 3
                title: "Event Photography Package",
                subtitle: "Limited-Time Event Offer",
                details: [
                    "Full-day event coverage.",
                    "50+ professionally edited high-resolution images.",
                    "Customized photo album design.",
                    "Delivery within 10 business days."
                ],
                bookNow: "Book Now",
                shareMessage: "Capture your event memories with this exclusive photography offer!",
                whatsappMessage: "Limited-Time Event Photography Offer! I am pleased to accept this offer. Thank you for this opportunity.",
                emailSubject: "Limited-Time Event Photography Offer",
                emailBody: "Hello! I am pleased to accept this offer. Thank you for this opportunity."
            }
        ]
    },
    fr: {
        noOffersMessage: {
            text: "Merci de votre intérêt pour nos services ! Nous cherchons toujours des moyens de fournir une valeur exceptionnelle à nos clients. Bien que nous n'ayons aucune offre spéciale disponible pour le moment, nous vous encourageons à nous suivre sur Instagram pour être informé en premier des promotions futures et des offres exclusives.",
            button: "Suivez-nous sur Instagram"
        },
        offers: [
            {
                // Offer 1
                title: "📸 Capturez Vos Moments Spéciaux ! or 💖 Saint-Valentin 💖",
                subtitle: "Offre photographique limitée dans le temps à Lyon",
                details: [
                    "📸 Profitez d'une session personnalisée d'une durée de 1 à 1,5 heure",
                    "✨ Un maximum de 40 photos capturées avec expertise, les photos seront reçues en ligne, et vous recevrez vos images époustouflantes dans les 10 jours",
                    "📅 Ne manquez pas cette offre, valable jusqu'au 15/02/2025",
                    "💶 Tout cela pour seulement 50 euros"
                ],
                bookNow: "Réserver maintenant",
                shareMessage: "Capturez vos moments spéciaux avec cette offre photographique exclusive !",
                whatsappMessage: "Offre photographique limitée dans le temps ! Je suis ravi d'accepter cette offre. Merci pour cette opportunité.",
                emailSubject: "Offre photographique limitée dans le temps",
                emailBody: "Bonjour ! Je suis ravi d'accepter cette offre. Merci pour cette opportunité."
            },
            {
                // Offer 2
                title: "🌙 Offre spéciale Aïd el-Fitr.",
                subtitle: "Offre à durée limitée uniquement pour les 3 jours de l'Aïd. à Lyon",
                details: [
                    "📷 45 minutes avec un photographe professionnel",
                    "📸 35 images haute résolution éditées par des professionnels. 🕧 Livraison sous 24 heures.",
                    "✨ Parfait pour les familles, les couples et les particuliers",
                    "💶 Tout cela pour seulement 50 euros"
                ],
                bookNow: "Réserver maintenant",
                shareMessage: "Immortalisez vos souvenirs de l'Aïd el-Fitr avec cette offre photographique exclusive !",
                whatsappMessage: "Offre photographique Aïd el-Fitr à durée limitée ! J'ai le plaisir d'accepter cette offre. Merci pour cette opportunité.",
                emailSubject: "Offre photographique Aïd el-Fitr à durée limitée",
                emailBody: "Bonjour ! J'ai le plaisir d'accepter cette offre. Merci pour cette opportunité."
            },
            {
                // Offer 3
                title: "Forfait Photographie d'Événement",
                subtitle: "Offre événementielle limitée dans le temps",
                details: [
                    "Couverture d'événement toute la journée.",
                    "50+ images haute résolution éditées professionnellement.",
                    "Conception d'album photo personnalisé.",
                    "Livraison dans les 10 jours ouvrables."
                ],
                bookNow: "Réserver maintenant",
                shareMessage: "Capturez vos souvenirs d'événement avec cette offre photographique exclusive !",
                whatsappMessage: "Offre photographique événementielle limitée dans le temps ! Je suis ravi d'accepter cette offre. Merci pour cette opportunité.",
                emailSubject: "Offre photographique événementielle limitée dans le temps",
                emailBody: "Bonjour ! Je suis ravi d'accepter cette offre. Merci pour cette opportunité."
            }
        ]
    }
};

// Function to update the content based on the selected language
  function updateContent(language) {
    const noOffersMessage = document.getElementById('no-offers-message');
    const offerCards = document.querySelectorAll('.offer-card');

    // Update the "No Offers" message
    if (noOffersMessage) {
        noOffersMessage.querySelector('p').textContent = languageConfig[language].noOffersMessage.text;
        noOffersMessage.querySelector('a.btn').textContent = languageConfig[language].noOffersMessage.button;
    }

    // Update the offer cards
    offerCards.forEach((card, index) => {
        const offer = languageConfig[language].offers[index];
        if (offer) {
            card.querySelector('.offer-title').textContent = offer.title;
            card.querySelector('.offer-subtitle').textContent = offer.subtitle;
            card.querySelector('.offer-details').innerHTML = offer.details.map(detail => `<p>${detail}</p>`).join('');
            card.querySelector('.btn--primary').textContent = offer.bookNow;
        }
    });
}

// Function to initialize the offers section
function initializeOffers() {
    const offerCards = document.querySelectorAll('.offer-card');
    const noOffersMessage = document.createElement('div');
    noOffersMessage.id = 'no-offers-message';
    noOffersMessage.innerHTML = `
        <p>${languageConfig.en.noOffersMessage.text}</p>
        <a href="https://www.instagram.com/soliman.omran" target="_blank" class="btn btn--primary">${languageConfig.en.noOffersMessage.button}</a>
    `;

    // Insert the message at the top of the <main> container (right below the nav)
    const mainContainer = document.querySelector('main.exclusive-offer');
    mainContainer.insertBefore(noOffersMessage, mainContainer.firstChild);

    // Show or hide offers based on the `showOffers` variable and the offerVisibility configuration
    if (showOffers) {
        // Show or hide each offer based on the offerVisibility configuration
        offerCards.forEach((card, index) => {
            const offerKey = `offer${index + 1}`; // offer1, offer2, offer3
            if (offerVisibility[offerKey]) {
                card.style.display = 'flex'; // Show the offer
            } else {
                card.style.display = 'none'; // Hide the offer
            }
        });
        noOffersMessage.style.display = 'none'; // Hide the message if any offer is visible
    } else {
        // Hide all offers if showOffers is false
        offerCards.forEach(card => {
            card.style.display = 'none';
        });
        noOffersMessage.style.display = 'block'; // Show the message
    }

    // Get the saved language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default to English if no preference is saved
    console.log('Initializing offers with language:', savedLanguage);

    // Update the offers content based on the saved language
    updateContent(savedLanguage);
}

// Share Offer Functionality
function shareOffer() {
    const currentLanguage = document.documentElement.lang; // Get the current language
    const shareData = {
        title: languageConfig[currentLanguage].offers[0].title, // Use the title of the first offer
        text: languageConfig[currentLanguage].offers[0].shareMessage, // Use the share message
        url: window.location.href,
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Offer shared successfully!'))
            .catch((error) => console.error('Error sharing:', error));
    } else {
        alert(currentLanguage === 'en' 
            ? 'Your browser does not support sharing. Copy the link manually.' 
            : 'Votre navigateur ne prend pas en charge le partage. Copiez le lien manuellement.');
    }
}

// Book Now Functionality
function handleBookNow() {
    const currentLanguage = document.documentElement.lang; // Get the current language
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const phoneNumber = "+33625965257"; // Your WhatsApp number
    const email = "omransoliman.pv@gmail.com"; // Your email address

    if (isMobile) {
        // Open WhatsApp on mobile
        const message = languageConfig[currentLanguage].offers[0].whatsappMessage; // Use the WhatsApp message
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    } else {
        // Send email on desktop
        const subject = languageConfig[currentLanguage].offers[0].emailSubject; // Use the email subject
        const body = languageConfig[currentLanguage].offers[0].emailBody; // Use the email body
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    }
}

// Initialize the offers section when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeOffers);


