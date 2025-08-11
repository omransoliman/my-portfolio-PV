// Reviews Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Reviews page loaded');
    
    // Initialize page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Start cache-first flow (global prefetch in navigation.js populates cache)
    startReviewsFlow();
});

// Google Sheets Web App URL (always fetch fresh)
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxS84YQrgPQHzJ5Nu7u2wKdMPddIONrTuAtQp0EEEfamgPwSUmvSYSXpWnKcPAuXXg/exec';

// Fetch original (full) reviews and refresh UI (always network)
async function fetchOriginalReviewsAndRefreshUI() {
    try {
        try { console.debug('[Reviews][Fetch][BG] starting originals'); } catch(_) {}
        const resp = await fetch(GOOGLE_SHEETS_WEB_APP_URL, { cache: 'no-store' });
        if (!resp.ok) throw new Error('Network response was not ok');
        const data = await resp.json();
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
            try { console.debug('[Reviews][Fetch][BG] received originals', { count: data.reviews.length, lastUpdated: data.lastUpdated }); } catch(_) {}
            // Render full, original data (includes avatars)
            renderReviews(data.reviews);
        }
    } catch (e) {
        console.debug('Background refresh of original reviews failed:', e);
    }
}

async function startReviewsFlow() {
    const loadingContainer = document.querySelector('.loading-container');
    const reviewsGrid = document.getElementById('reviewsGrid');
    const errorContainer = document.getElementById('errorContainer');
    // Show loading state
    if (loadingContainer) loadingContainer.style.display = 'flex';
    if (reviewsGrid) reviewsGrid.innerHTML = '';
    if (errorContainer) errorContainer.style.display = 'none';

    try {
        // Always fetch from network
        await loadReviewsFromNetwork();
    } catch (e) {
        console.warn('Failed to load reviews:', e);
        await loadReviewsFromNetwork();
    }
}

// localStorage polling removed

// Function to load reviews from Google Sheets (network only)
async function loadReviewsFromNetwork() {
    const loadingContainer = document.querySelector('.loading-container');
    const reviewsGrid = document.getElementById('reviewsGrid');
    const errorContainer = document.getElementById('errorContainer');
    
    try {
        // Show loading state
        loadingContainer.style.display = 'flex';
        reviewsGrid.innerHTML = '';
        errorContainer.style.display = 'none';
        
        console.log('Fetching reviews from:', GOOGLE_SHEETS_WEB_APP_URL);
        
        // Use simple fetch instead of JSONP
        const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        try { console.debug('[Reviews][Fetch] received', { count: Array.isArray(data?.reviews) ? data.reviews.length : 'n/a', lastUpdated: data.lastUpdated }); } catch(_) {}
        
        // Check if there's an error in the response
        if (data && data.error) {
            throw new Error(data.message || 'Error from Google Apps Script');
        }
        
        // Hide loading state
        loadingContainer.style.display = 'none';
        
        // Render reviews - the Apps Script returns data.reviews
        if (data && data.reviews && data.reviews.length > 0) {
            renderReviews(data.reviews);
            
            // Log additional info from Apps Script
            console.log(`Total reviews: ${data.totalReviews}`);
            console.log(`Total rows in sheet: ${data.totalRowsInSheet}`);
            console.log(`Last updated: ${data.lastUpdated}`);
        } else {
            throw new Error('No reviews data received');
        }
        
        // Rendering complete
        
    } catch (error) {
        console.error('Error loading reviews from network:', error);
        
        // Hide loading state and show error temporarily, then load mock data
        loadingContainer.style.display = 'none';
        errorContainer.style.display = 'flex';
        
        // Load mock data as fallback after 3 seconds
        console.log('Loading mock data as fallback...');
        setTimeout(() => {
            errorContainer.style.display = 'none';
            loadMockReviews();
            ensureFloatingButtonVisible();
        }, 3000);
    }
}

// JSONP path removed; standard fetch is sufficient when CORS is configured

// Function to render reviews
function renderReviews(reviews) {
    const reviewsGrid = document.getElementById('reviewsGrid');
    
    if (!reviews || reviews.length === 0) {
        reviewsGrid.innerHTML = '<div class="no-reviews"><p>Aucun avis disponible pour le moment.</p></div>';
        return;
    }
    
    // Sort reviews by date (most recent first) if possible
    const sortedReviews = reviews.sort((a, b) => {
        // Try to parse dates for sorting
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // If dates are valid, sort by date; otherwise maintain original order
        if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateB - dateA;
        }
        return 0;
    });
    
    reviewsGrid.innerHTML = sortedReviews.map((review, index) => createReviewCard(review, index)).join('');
    
    // Add event listeners to new cards
    addCardEventListeners();
    
    // Rendering complete
}

// Function to create a review card HTML
function createReviewCard(review, index) {
    // Ensure we have valid data
    const name = review.name || 'Anonyme';
    const date = review.date || '';
    const rating = parseInt(review.rating) || 5;
    const comment = review.comment || '';
    
    const stars = generateStars(rating);
    
    // Handle avatar image - Apps Script stores Base64 data in avatar field
    let avatarSrc = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80';
    
    if (review.avatar && review.avatar.trim() !== '') {
        const avatarData = review.avatar.trim();
        
        // Check if it's already a complete data URL
        if (avatarData.startsWith('data:image/')) {
            avatarSrc = avatarData;
        }
        // Check if it's a regular HTTP URL
        else if (avatarData.startsWith('http')) {
            avatarSrc = avatarData;
        }
        // Check if it's Base64 data starting with common patterns
        else if (avatarData.match(/^[A-Za-z0-9+/]+=*$/)) {
            // It's Base64 data without data URL prefix
            avatarSrc = `data:image/jpeg;base64,${avatarData}`;
        }
    }
    
    // Add staggered animation delay
    const animationDelay = (index + 1) * 0.2;
    
    return `
        <div class="review-card" style="animation-delay: ${animationDelay}s;">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${avatarSrc}" 
                         alt="${name}" 
                         class="reviewer-avatar" 
                         onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'"
                         onload="console.log('Avatar loaded for ${name}')">
                    <div class="reviewer-details">
                        <h3 class="reviewer-name">${escapeHtml(name)}</h3>
                        <p class="review-date">${escapeHtml(date)}</p>
                    </div>
                </div>
                <div class="review-rating">
                    ${stars}
                </div>
            </div>
            <div class="review-content">
                <p>${escapeHtml(comment)}</p>
            </div>
        </div>
    `;
}

// Function to generate star rating HTML
function generateStars(rating) {
    let stars = '';
    const validRating = Math.max(1, Math.min(5, parseInt(rating) || 5));
    
    for (let i = 1; i <= 5; i++) {
        if (i <= validRating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Function to escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to add event listeners to review cards
function addCardEventListeners() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    reviewCards.forEach(card => {
        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

// Function to add a new review (POST JSON)
async function addReview(reviewData) {
    // Replace with your deployed Add Review Apps Script URL
    const ADD_REVIEW_URL = 'https://script.google.com/macros/s/AKfycbwHvcG2nHrS8WVX3xuNEX2JurZIpqWGE0q0f9NadDTHy3iTMNcOCqXB_CGh8jfr3sLlRg/exec';

    // Enforce 300-char max on client side
    if (reviewData.comment && reviewData.comment.length > 300) {
        reviewData.comment = reviewData.comment.slice(0, 300);
    }

    // Send as application/x-www-form-urlencoded to avoid CORS preflight
    const body = new URLSearchParams({
        name: reviewData.name || '',
        email: reviewData.email || '',
        rating: String(reviewData.rating || ''),
        comment: reviewData.comment || '',
        date: reviewData.date || '',
        avatar: reviewData.avatar || ''
    });

    const response = await fetch(ADD_REVIEW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: body.toString()
    });

    if (!response.ok) throw new Error('Network response was not ok');
    // Try to parse JSON; if it fails, log text (likely deployment/permission HTML)
    let data;
    try {
        data = await response.json();
    } catch (err) {
        const text = await response.text();
        console.error('Non-JSON response from Apps Script:', text.slice(0, 500));
        throw new Error('Server did not return JSON. Check Apps Script deployment and access.');
    }
    if (data && data.error) throw new Error(data.message || 'Failed to add review');
    return data;
}

// For development/testing, you can use this mock data function
function loadMockReviews() {
    const mockData = {
        reviews: [
            
            {
                name: "Looding",
                date: "02/03/2025",
                rating: 4,
                comment: "Looding",
                avatar: ""
            }
        ],
        totalReviews: 3,
        totalRowsInSheet: 4,
        lastUpdated: new Date().toISOString()
    };
    
    renderReviews(mockData.reviews);
    ensureFloatingButtonVisible();
}

// Uncomment the line below if you want to test with mock data instead of Google Sheets
// loadMockReviews();

// Floating button is controlled by CSS only; no JS positioning needed

// Add Review Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    const addReviewBtn = document.getElementById('add-review-btn');
    const addReviewPopup = document.getElementById('add-review-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const cancelReviewBtn = document.getElementById('cancel-review-btn');
    const addReviewForm = document.getElementById('add-review-form');
    const stars = document.querySelectorAll('.stars i');
    const ratingInput = document.getElementById('review-rating');

    // Open popup
    addReviewBtn.addEventListener('click', function() {
        addReviewPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close popup functions
    function closePopup() {
        addReviewPopup.classList.remove('active');
        document.body.style.overflow = 'auto';
        addReviewForm.reset();
        resetStars();
    }

    closePopupBtn.addEventListener('click', closePopup);
    cancelReviewBtn.addEventListener('click', closePopup);

    // Close popup when clicking outside
    addReviewPopup.addEventListener('click', function(e) {
        if (e.target === addReviewPopup) {
            closePopup();
        }
    });

    // Live character counter for comment (max 300)
    const commentTextarea = document.getElementById('review-comment');
    const counterEl = document.getElementById('comment-counter');
    if (commentTextarea && counterEl) {
        const updateCounter = () => {
            const len = Math.min(300, commentTextarea.value.length);
            counterEl.textContent = `${len} / 300`;
        };
        commentTextarea.addEventListener('input', () => {
            if (commentTextarea.value.length > 300) {
                commentTextarea.value = commentTextarea.value.slice(0, 300);
            }
            updateCounter();
        });
        // Initialize
        updateCounter();
    }

    // Star rating functionality
    function resetStars() {
        stars.forEach((star, index) => {
            star.className = 'far fa-star';
        });
        ratingInput.value = '5';
    }

    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = index + 1;
            ratingInput.value = rating;
            
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });

        star.addEventListener('mouseenter', function() {
            const rating = index + 1;
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });

        star.addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingInput.value);
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });

    // Form submission
    addReviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(addReviewForm);
        const reviewData = {
            name: formData.get('name'),
            email: formData.get('email'),
            rating: formData.get('rating'),
            comment: (formData.get('comment') || '').toString().slice(0, 300),
            date: new Date().toLocaleDateString('fr-FR')
        };

        // Handle image file (now required)
        const imageFile = formData.get('image');
        if (!imageFile || imageFile.size === 0) {
            throw new Error('Photo is required');
        }
        
        // Check file size before processing
        const maxSizeMB = 10; // 10MB limit before compression
        if (imageFile.size > maxSizeMB * 1024 * 1024) {
            console.warn(`Large image detected: ${Math.round(imageFile.size / (1024 * 1024))}MB. Will be compressed.`);
        }
        
        try {
            const base64Image = await convertFileToBase64(imageFile);
            // Guard: ensure image fits Google Sheets cell (~50k chars). Keep a safety margin.
            if (base64Image && base64Image.length > 48000) {
                throw new Error('Image too large after compression. Please choose a smaller photo.');
            }
            reviewData.avatar = base64Image;
            console.log(`Image processed: ${Math.round(base64Image.length / 1024)}KB, length=${base64Image.length}`);
        } catch (error) {
            console.error('Error converting image:', error);
            throw new Error('Error processing image');
        }

        let originalText = '';
        try {
            // Show loading state
            const submitBtn = addReviewForm.querySelector('.submit-btn');
            originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            // Submit review using POST JSON
            await addReview(reviewData);
            
            // Success
            closePopup();
            alert('Avis ajouté avec succès!');
            
            // Reload reviews to show the new one
            loadReviews();
            
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Erreur lors de l\'ajout de l\'avis. Veuillez réessayer.');
        } finally {
            // Reset button
            const submitBtn = addReviewForm.querySelector('.submit-btn');
            if (submitBtn && originalText) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    // Helper function to compress image
    function compressImage(file, maxSizeKB = 40) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                // Calculate new dimensions (max 500px width/height)
                let { width, height } = img;
                const maxDimension = 500;
                
                if (width > height) {
                    if (width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with compression
                let quality = 0.75;
                let dataUrl = canvas.toDataURL('image/jpeg', quality);
                
                // Check file size and reduce quality if needed
                while (dataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
                    quality -= 0.1;
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                }
                
                console.log(`Image compressed: ${Math.round(dataUrl.length / 1024)}KB (quality: ${quality.toFixed(1)})`);
                resolve(dataUrl);
            };
            
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    // Helper function to convert file to base64 (with compression)
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            // Check if it's an image file
            if (file.type.startsWith('image/')) {
                // Compress image first
                compressImage(file).then(resolve).catch(reject);
            } else {
                // For non-image files, use original method
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            }
        });
    }
    // No MutationObserver needed for the fixed button
});