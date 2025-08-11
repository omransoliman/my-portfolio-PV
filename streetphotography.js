// Replace with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjmrXRMIAPHZC99fyAldDA6VRTJH0C9WMMSviF8nukjmEkULpdSECVDQLY3Beu0Sfa-g/exec';

// Google Apps Script URL for fetching photos (you'll need to deploy the google-apps-script-streetphotography-slideshow.js)
// Replace this with your deployed Apps Script URL after deployment
const PHOTOS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyOQSQvdJpY5RKGNXw0bp8KaSthKLn8rsOptYAzPnibaCpYJJ7L9GSEdm69xyPjStC_YQ/exec'; // TODO: Replace after deploying the Apps Script

// Email Form Handling
const emailForm = document.getElementById('emailForm');
const fullNameInput = document.getElementById('fullNameInput');
const emailInput = document.getElementById('emailInput');
const languageSelect = document.getElementById('languageSelect');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const submitButton = document.querySelector('.submit-button');

emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const language = languageSelect.value;
    
    // Validate form inputs
    if (!fullName || !email || !language || !isValidEmail(email)) {
        showError('Please fill in all fields with valid information.');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    hideMessages();
    
    try {
        // Prepare data to send to Google Apps Script
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('language', language);
        formData.append('subscribe', 'Yes');
        
        // Send data to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            cache: 'no-store'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess();
            resetForm();
        } else {
            showError(result.message || 'Something went wrong. Please try again.');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        setLoadingState(false);
    }
});

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setLoadingState(loading) {
    if (loading) {
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
        submitButton.disabled = true;
    } else {
        submitButton.innerHTML = '<i class="fas fa-download"></i> GET MY FREE PHOTOS';
        submitButton.disabled = false;
    }
}

function showSuccess() {
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

function showError(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorMessageElement.classList.add('show');
    setTimeout(() => {
        errorMessageElement.classList.remove('show');
    }, 5000);
}

function hideMessages() {
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
}

function resetForm() {
    fullNameInput.value = '';
    emailInput.value = '';
    languageSelect.value = '';
}

// Photo gallery scroll enhancement
const photoGallery = document.querySelector('.photo-gallery');
let isScrolling = false;

if (photoGallery) {
    photoGallery.addEventListener('wheel', (e) => {
        if (!isScrolling) {
            e.preventDefault();
            photoGallery.scrollLeft += e.deltaY;
            
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 50);
        }
    });
}

// Photo click effect
const photoItems = document.querySelectorAll('.photo-item');
photoItems.forEach(item => {
    item.addEventListener('click', () => {
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = '';
        }, 150);
    });
});

// Add smooth entrance animation for photos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

photoItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Message box hover effects
const messageBoxes = document.querySelectorAll('.message-box');
messageBoxes.forEach(box => {
    box.addEventListener('mouseenter', () => {
        box.style.transform = 'translateY(-5px)';
        box.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    });
    
    box.addEventListener('mouseleave', () => {
        box.style.transform = 'translateY(0)';
        box.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    });
});

// Input validation styling
function addInputValidation() {
    const inputs = [fullNameInput, emailInput, languageSelect];
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.style.borderColor = 'rgba(231, 76, 60, 0.6)';
            } else if (input === emailInput && !isValidEmail(input.value.trim())) {
                input.style.borderColor = 'rgba(231, 76, 60, 0.6)';
            } else {
                input.style.borderColor = 'rgba(46, 204, 113, 0.6)';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
    });
}

// Initialize input validation
addInputValidation();

// ============================================
// PHOTO GALLERY DYNAMIC LOADING FROM GOOGLE SHEETS
// ============================================

/**
 * Fetch photos from Google Sheets via Apps Script
 */
async function fetchPhotosFromGoogleSheets() {
    try {
        console.log('Fetching photos from Google Sheets...');
        
        // Show loading state in gallery
        const photoGallery = document.querySelector('.photo-gallery');
        if (!photoGallery) {
            console.error('Photo gallery element not found');
            return;
        }
        
        // Add loading indicator
        photoGallery.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">
                <i class="fas fa-spinner fa-spin" style="font-size: 2em; margin-bottom: 10px;"></i>
                <p>Loading photos...</p>
            </div>
        `;
        
        // Check if we have a deployed URL
        if (PHOTOS_SCRIPT_URL === 'YOUR_DEPLOYED_PHOTOS_SCRIPT_URL') {
            console.warn('Photos Script URL not configured. Using fallback photos.');
            // Use existing hardcoded photos as fallback
            displayFallbackPhotos();
            return;
        }
        
        // Fetch photos from Google Apps Script
        const response = await fetch(PHOTOS_SCRIPT_URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        console.log('Total photos available:', data.totalCount);
        
        if (data.success && data.photos && Array.isArray(data.photos)) {
            // Randomly select 5 photos from all available photos
            const randomPhotos = getRandomPhotos(data.photos, 5);
            console.log('Selected', randomPhotos.length, 'random photos from', data.photos.length, 'total photos');
            displayPhotos(randomPhotos);
        } else {
            console.error('Invalid response format:', data);
            displayFallbackPhotos();
        }
        
    } catch (error) {
        console.error('Error fetching photos:', error);
        // Fall back to hardcoded photos if fetch fails
        displayFallbackPhotos();
    }
}

/**
 * Display photos in the gallery
 * @param {Array} photos - Array of photo objects from Google Sheets
 */
function displayPhotos(photos) {
    const photoGallery = document.querySelector('.photo-gallery');
    if (!photoGallery) return;
    
    // Clear loading state
    photoGallery.innerHTML = '';
    
    // Display each photo
    photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        const img = document.createElement('img');
        img.src = photo.imageUrl;
        img.alt = photo.alt || `Street Photo ${index + 1}`;
        img.loading = 'lazy'; // Add lazy loading
        
        // Add error handling for images
        img.onerror = function() {
            console.error(`Failed to load image: ${photo.imageUrl}`);
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
        };
        
        photoItem.appendChild(img);
        photoGallery.appendChild(photoItem);
        
        // Add click effect
        photoItem.addEventListener('click', () => {
            photoItem.style.transform = 'scale(0.95)';
            setTimeout(() => {
                photoItem.style.transform = '';
            }, 150);
        });
        
        // Add entrance animation
        photoItem.style.opacity = '0';
        photoItem.style.transform = 'translateY(30px)';
        photoItem.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        // Trigger animation
        setTimeout(() => {
            photoItem.style.opacity = '1';
            photoItem.style.transform = 'translateY(0)';
        }, 50);
    });
    
    console.log(`Displayed ${photos.length} photos from Google Sheets`);
}

/**
 * Display fallback photos (hardcoded URLs)
 */
function displayFallbackPhotos() {
    const fallbackPhotos = [
        {
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/bkhf3gr1m8blab1uj6n80/IMG_0215.jpg?rlkey=lo5z99ztbeeakie9ltu1yfom8&st=r7xph14y&raw=1',
            alt: 'Street Photo 1'
        },
        {
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/u99b9jc0l4ejukrutf9fj/IMG_0462.jpg?rlkey=ch8ea2puovt95xfw93sylpkgj&st=ckl5yjzm&raw=1',
            alt: 'Street Photo 2'
        },
        {
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/f7di3bnxbi7l4tylj1zz7/IMG_1645.jpg?rlkey=okri8h1xsz85srqn8bph3mcao&st=d5ilef1m&raw=1',
            alt: 'Street Photo 3'
        },
        {
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/65bksbes1mu92yy1fsbmv/IMG_3178.jpg?rlkey=8nlojb9navot0lpqe7sb83gnw&st=jl68iu2a&raw=1',
            alt: 'Street Photo 4'
        },
        {
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/4c12g8mtj9bm0xkxdbi0y/IMG_1856.jpg?rlkey=m6mgkobl7oofjl8pogu0n8gi9&st=me4svoms&raw=1',
            alt: 'Street Photo 5'
        }
    ];
    
    console.log('Using fallback photos');
    displayPhotos(fallbackPhotos);
}

/**
 * Initialize photo gallery when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display photos from Google Sheets
    fetchPhotosFromGoogleSheets();
    
    // Refresh photos every 5 minutes (optional)
    // setInterval(fetchPhotosFromGoogleSheets, 5 * 60 * 1000);
});

/**
 * Get random photos from an array
 * @param {Array} photos - Array of all photos
 * @param {number} count - Number of photos to select
 * @return {Array} Array of randomly selected photos
 */
function getRandomPhotos(photos, count = 5) {
    // If we have fewer photos than requested, return all
    if (photos.length <= count) {
        return photos;
    }
    
    // Shuffle array using Fisher-Yates algorithm
    const shuffled = [...photos];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the first 'count' photos from shuffled array
    return shuffled.slice(0, count);
}

/**
 * Manual refresh function (can be called from console for testing)
 */
window.refreshPhotos = function() {
    console.log('Manually refreshing photos...');
    fetchPhotosFromGoogleSheets();
};

/**
 * Get all photos without randomization (for debugging)
 */
window.showAllPhotos = function() {
    console.log('Fetching all photos without randomization...');
    
    if (PHOTOS_SCRIPT_URL === 'YOUR_DEPLOYED_PHOTOS_SCRIPT_URL') {
        console.error('Photos Script URL not configured');
        return;
    }
    
    fetch(PHOTOS_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.photos) {
                console.log('All photos:', data.photos);
                displayPhotos(data.photos);
            }
        })
        .catch(error => console.error('Error:', error));
};