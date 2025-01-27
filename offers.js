// Set this variable to true or false to control the visibility of offers
const showOffers = true; // Change to `true` to show offers, `false` to hide them

// Configuration object to control the visibility of each offer
const offerVisibility = {
    offer1: true,  // Set to `true` to show Offer 1, `false` to hide it
    offer2: true, // Set to `true` to show Offer 2, `false` to hide it
    offer3: true   // Set to `true` to show Offer 3, `false` to hide it
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
                title: "Capture Your Special Moments!",
                subtitle: "Limited-Time Photography Offer",
                details: [
                    "Free consultation session (1 hour to 1 hour and a half max).",
                    "Complimentary photo editing for your selected images.",
                    "Customized photography packages tailored to your needs.",
                    "High-resolution digital images delivered within 7 days."
                ],
                bookNow: "Book Now",
                shareMessage: "Capture your special moments with this exclusive photography offer!",
                whatsappMessage: "Limited-Time Photography Offer! I am pleased to accept this offer. Thank you for this opportunity.",
                emailSubject: "Limited-Time Photography Offer",
                emailBody: "Hello! I am pleased to accept this offer. Thank you for this opportunity."
            },
            {
                title: "Family Photography Package",
                subtitle: "Limited-Time Family Offer",
                details: [
                    "1-hour family photoshoot session.",
                    "10 professionally edited high-resolution images.",
                    "Customized family portraits for your home.",
                    "Delivery within 5 business days."
                ],
                bookNow: "Book Now",
                shareMessage: "Capture your family memories with this exclusive photography offer!",
                whatsappMessage: "Limited-Time Family Photography Offer! I am pleased to accept this offer. Thank you for this opportunity.",
                emailSubject: "Limited-Time Family Photography Offer",
                emailBody: "Hello! I am pleased to accept this offer. Thank you for this opportunity."
            },
            {
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
                title: "Capturez vos moments spéciaux !",
                subtitle: "Offre photographique limitée dans le temps",
                details: [
                    "Session de consultation gratuite (1 heure à 1 heure et demie maximum).",
                    "Retouche photo gratuite pour vos images sélectionnées.",
                    "Forfaits photographiques personnalisés adaptés à vos besoins.",
                    "Images numériques haute résolution livrées dans les 7 jours."
                ],
                bookNow: "Réserver maintenant",
                shareMessage: "Capturez vos moments spéciaux avec cette offre photographique exclusive !",
                whatsappMessage: "Offre photographique limitée dans le temps ! Je suis ravi d'accepter cette offre. Merci pour cette opportunité.",
                emailSubject: "Offre photographique limitée dans le temps",
                emailBody: "Bonjour ! Je suis ravi d'accepter cette offre. Merci pour cette opportunité."
            },
            {
                title: "Forfait Photographie Familiale",
                subtitle: "Offre familiale limitée dans le temps",
                details: [
                    "Séance photo familiale d'une heure.",
                    "10 images haute résolution éditées professionnellement.",
                    "Portraits familiaux personnalisés pour votre maison.",
                    "Livraison dans les 5 jours ouvrables."
                ],
                bookNow: "Réserver maintenant",
                shareMessage: "Capturez vos souvenirs familiaux avec cette offre photographique exclusive !",
                whatsappMessage: "Offre photographique familiale limitée dans le temps ! Je suis ravi d'accepter cette offre. Merci pour cette opportunité.",
                emailSubject: "Offre photographique familiale limitée dans le temps",
                emailBody: "Bonjour ! Je suis ravi d'accepter cette offre. Merci pour cette opportunité."
            },
            {
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

    // Set default language to English
    updateContent('en');
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

// Add event listener to the language switch button
document.querySelector('.language-switch')?.addEventListener('click', () => {
    const currentLanguage = document.documentElement.lang;
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    document.documentElement.lang = newLanguage;
    updateContent(newLanguage);
});