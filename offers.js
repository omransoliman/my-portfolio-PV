// offers.js

// Function to toggle the visibility of offers
function toggleOffers() {
    const offerCards = document.querySelectorAll('.offer-card');
    const noOffersMessage = document.getElementById('no-offers-message');

    // Check if offers are currently visible
    const isVisible = offerCards[0].style.display !== 'none';

    if (isVisible) {
        // Hide all offer cards
        offerCards.forEach(card => {
            card.style.display = 'none';
        });

        // Show the no offers message
        noOffersMessage.style.display = 'block';
    } else {
        // Show all offer cards
        offerCards.forEach(card => {
            card.style.display = 'flex';
        });

        // Hide the no offers message
        noOffersMessage.style.display = 'none';
    }
}

// Function to initialize the offers section
function initializeOffers() {
    // Create a button to toggle offers visibility
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Offers';
    toggleButton.classList.add('btn', 'btn--primary');
    toggleButton.onclick = toggleOffers;

    // Insert the toggle button before the offers section
    const offersSection = document.querySelector('.exclusive-offer');
    offersSection.parentNode.insertBefore(toggleButton, offersSection);

    // Create a message to display when offers are hidden
    const noOffersMessage = document.createElement('div');
    noOffersMessage.id = 'no-offers-message';
    noOffersMessage.style.display = 'none'; // Initially hidden
    noOffersMessage.innerHTML = `
        <p>Thank you for your interest in our services! We're always looking for ways to provide exceptional value to our customers. While we don't have any special offers available at this time, we encourage you to follow us on Instagram to be the first to know about future promotions and exclusive deals.</p>
        <a href="https://www.instagram.com/soliman.omran" target="_blank" class="btn btn--primary">Follow us on Instagram</a>
    `;

    // Insert the message after the offers section
    offersSection.parentNode.insertBefore(noOffersMessage, offersSection.nextSibling);
}

// Initialize the offers section when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeOffers);