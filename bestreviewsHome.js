// Google Sheets API Configuration
const sheetId = '1iVf5w-zkfOs7QA5NOugbzlOivtWkrXddtpj7pN0sNgo'; // Replace with your actual sheet ID
const apiKey = 'AIzaSyBw44PAIqR2k7WVdZsAA2v1GU8ZrDpTGPQ'; // Replace with your actual API key

// Function to fetch reviews from Google Sheets
function fetchReviews() {
    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const reviews = data.values ? data.values.slice(1) : []; // Skip the header row
            return reviews;
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            return [];
        });
}

// Function to display a review
function displayReview(containerId, date, name, rating, comment, imageUrl) {
    const reviewsContainer = document.getElementById(containerId);

    // Create a new review div
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('eachdiv');

    // Assign a class based on the review index (to mimic the design layout)
    const reviewCount = reviewsContainer.children.length;
    switch (reviewCount % 5) {
        case 0:
            reviewElement.classList.add('div1');
            break;
        case 1:
            reviewElement.classList.add('div2');
            break;
        case 2:
            reviewElement.classList.add('div3');
            break;
        case 3:
            reviewElement.classList.add('div4');
            break;
        case 4:
            reviewElement.classList.add('div5');
            break;
    }

    // Add the review content with styled rating stars
    reviewElement.innerHTML = `
        <div class="userdetails">
            <div class="imgbox">
                <img src="${imageUrl}" alt="${name}">
            </div>
            <div class="detbox">
                <p class="name">${name}</p>
                <p class="designation">${date}</p>
            </div>
        </div>
        <div class="review">
            <div class="stars">
                ${Array.from({ length: 5 }, (_, i) => `
                    <span class="star ${i < rating ? '' : 'empty'}">★</span>
                `).join('')}
            </div>
            <h4>${comment}</h4>
        </div>
    `;

    // Append the review to the container
    reviewsContainer.appendChild(reviewElement);
}

// Function to display the top 3 reviews (for the home page)
function displayTopReviews(reviews) {
    // Sort reviews by rating (descending order)
    reviews.sort((a, b) => b[2] - a[2]);
    // Get the top 3 reviews
    const topReviews = reviews.slice(0, 3);
    // Display the top reviews
    topReviews.forEach(review => {
        const [date, name, rating, comment, imageUrl] = review;
        displayReview('topReviews', date, name, rating, comment, imageUrl);
    });
}

// Function to display all reviews (for the reviews page)
function displayAllReviews(reviews) {
    reviews.reverse().forEach(review => {
        const [date, name, rating, comment, imageUrl] = review;
        displayReview('reviews', date, name, rating, comment, imageUrl);
    });
}

// Fetch and display reviews based on the page
document.addEventListener('DOMContentLoaded', () => {
    fetchReviews().then(reviews => {
        if (document.getElementById('topReviews')) {
            // Home page: Display top 3 reviews
            displayTopReviews(reviews);
        } else if (document.getElementById('reviews')) {
            // Reviews page: Display all reviews
            displayAllReviews(reviews);
        }
    });
});

// Modal and Review Submission Logic
const scriptUrl = 'https://script.google.com/macros/s/AKfycbyLSkh-4eEUyf5O7iPzgAABDjZ4cqW0CEHc0LpsQ17xgmX5X0S8Z8_9736MrtNtwDKs/exec';

const errorMessageEl = document.getElementById('error-message');
const reviewButton = document.getElementById('reviewButton');
const reviewModal = document.getElementById('reviewModal');
const overlay = document.getElementById('overlay');
const closeModal = document.querySelector('.close');

// Open Modal
if (reviewButton) {
    reviewButton.addEventListener('click', () => {
        reviewModal.style.display = 'block';
        overlay.style.display = 'block';
    });
}

// Close Modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        reviewModal.style.display = 'none';
        overlay.style.display = 'none';
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        reviewModal.style.display = 'none';
        overlay.style.display = 'none';
    });
}

// Handle Form Submission
if (document.getElementById('reviewForm')) {
    document.getElementById('reviewForm').addEventListener('submit', function(event) {
        event.preventDefault();
        errorMessageEl.textContent = '';

        const name = document.getElementById('name').value.trim();
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value.trim();
        const imageFile = document.getElementById('image').files[0];

        if (!name || !comment) {
            errorMessageEl.textContent = 'Please fill in all fields.';
            return;
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            errorMessageEl.textContent = 'Image must be less than 5MB.';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            const date = new Date().toLocaleDateString();

            const data = {
                date: date,
                name: name,
                rating: rating,
                comment: comment,
                imageUrl: imageUrl
            };

            fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data)
            })
            .then(() => {
                displayReview('reviews', date, name, rating, comment, imageUrl);
                document.getElementById('reviewForm').reset();
                reviewModal.style.display = 'none';
                overlay.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                errorMessageEl.textContent = 'Failed to submit review. Please try again.';
            });
        }
        reader.readAsDataURL(imageFile);
    });
}