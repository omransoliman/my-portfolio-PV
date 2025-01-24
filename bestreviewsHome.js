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

// Fetch and display the top 3 reviews on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchReviews().then(reviews => {
        displayTopReviews(reviews);
    });
});