// offers.js

// Set this variable to true or false to control the visibility of offers
const showOffers = true; // Change to `true` to show offers, `false` to hide them

// Configuration object to control the visibility of each offer
const offerVisibility = {
    offer1: true,  // Set to `true` to show Offer 1, `false` to hide it
    offer2: false, // Set to `true` to show Offer 2, `false` to hide it
    offer3: false   // Set to `true` to show Offer 3, `false` to hide it
};

// Function to initialize the offers section
function initializeOffers() {
    const offerCards = document.querySelectorAll('.offer-card');
    const noOffersMessage = document.createElement('div');
    noOffersMessage.id = 'no-offers-message';
    noOffersMessage.innerHTML = `
        <p>Thank you for your interest in our services! We're always looking for ways to provide exceptional value to our customers. While we don't have any special offers available at this time, we encourage you to follow us on Instagram to be the first to know about future promotions and exclusive deals.</p>
        <a href="https://www.instagram.com/soliman.omran" target="_blank" class="btn btn--primary">Follow us on Instagram</a>
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
}

// Initialize the offers section when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeOffers);