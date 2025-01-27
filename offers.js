// offers.js

// Set this variable to true or false to control the visibility of offers
const showOffers = false; // Change to `true` to show offers, `false` to hide them

// Function to initialize the offers section
function initializeOffers() {
    const offerCards = document.querySelectorAll('.offer-card');
    const noOffersMessage = document.createElement('div');
    noOffersMessage.id = 'no-offers-message';
    noOffersMessage.innerHTML = `
        <p>Thank you for your interest in our services! We're always looking for ways to provide exceptional value to our customers. While we don't have any special offers available at this time, we encourage you to follow us on Instagram to be the first to know about future promotions and exclusive deals.</p>
        <a href="https://www.instagram.com/soliman.omran" target="_blank" class="btn btn--primary">Follow us on Instagram</a>
    `;

    // Insert the message after the offers section
    const offersSection = document.querySelector('.exclusive-offer');
    offersSection.parentNode.insertBefore(noOffersMessage, offersSection.nextSibling);

    // Show or hide offers based on the `showOffers` variable
    if (showOffers) {
        // Show offers
        offerCards.forEach(card => {
            card.style.display = 'flex';
        });
        noOffersMessage.style.display = 'none'; // Hide the message
    } else {
        // Hide offers
        offerCards.forEach(card => {
            card.style.display = 'none';
        });
        noOffersMessage.style.display = 'block'; // Show the message
    }
}

// Initialize the offers section when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeOffers);