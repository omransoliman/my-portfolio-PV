// Main page functionality
document.addEventListener('DOMContentLoaded', function() {
    
 // Home Portfolio Section
 const homePortfolioGrid = document.getElementById('home-portfolio-grid');
 const portfolioLoading = document.getElementById('portfolio-loading');


    // Home Reviews Section - always fetch fresh
    const REVIEWS_API_URL = 'https://script.google.com/macros/s/AKfycbxS84YQrgPQHzJ5Nu7u2wKdMPddIONrTuAtQp0EEEfamgPwSUmvSYSXpWnKcPAuXXg/exec';

    async function fetchHomeReviews() {
        try {
            const resp = await fetch(REVIEWS_API_URL, { cache: 'no-store', keepalive: true });
            if (!resp.ok) throw new Error('Home reviews fetch failed: ' + resp.status);
            const data = await resp.json();
            if (data && Array.isArray(data.reviews)) {
                return data.reviews;
            }
            throw new Error('Invalid reviews payload');
        } catch (e) {
            console.error('[Home] Network fetch for reviews failed:', e);
            throw e;
        }
    }

    async function loadHomeReviews() {
        const loadingEl = document.getElementById('reviewsLoading');
        const reviewsGrid = document.getElementById('homeReviewsGrid');
        const errorEl = document.getElementById('reviewsError');

        try {
            if (loadingEl) loadingEl.style.display = 'flex'; // Show "Chargement des avis..."
            if (reviewsGrid) reviewsGrid.innerHTML = '';
            if (errorEl) errorEl.style.display = 'none';

            const list = await fetchHomeReviews();

            // Sort by date descending when possible
            const sorted = [...list].sort((a, b) => {
                const da = new Date(a.date);
                const db_ = new Date(b.date);
                if (!isNaN(db_) && !isNaN(da)) return db_ - da;
                return 0;
            });

            const top3 = sorted.slice(0, 3);
            if (loadingEl) loadingEl.style.display = 'none';
            renderHomeReviews(top3);
        } catch (error) {
            console.error('[Home] Error loading reviews from IDB:', error);
            if (loadingEl) loadingEl.style.display = 'none';
            if (errorEl) errorEl.style.display = 'flex';
            // Keep error visible; no mock fallback
        }
    }
    
    // Function to render home reviews (top 3 only)
    function renderHomeReviews(reviews) {
        const reviewsGrid = document.getElementById('homeReviewsGrid');
        
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
        
        reviewsGrid.innerHTML = sortedReviews.map((review, index) => createHomeReviewCard(review, index)).join('');
    }
    
    // Function to create a home review card HTML
    function createHomeReviewCard(review, index) {
        // Ensure we have valid data
        const name = review.name || 'Anonyme';
        const date = review.date || '';
        const rating = parseInt(review.rating) || 5;
        const comment = review.comment || '';
        
        const stars = generateStars(rating);
        
        // Handle avatar image
        let avatarSrc = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80';
        
        if (review.avatar && review.avatar.trim() !== '') {
            const avatarData = review.avatar.trim();
            
            if (avatarData.startsWith('data:image/')) {
                avatarSrc = avatarData;
            }
            else if (avatarData.startsWith('http')) {
                avatarSrc = avatarData;
            }
            else if (avatarData.match(/^[A-Za-z0-9+/]+=*$/)) {
                avatarSrc = `data:image/jpeg;base64,${avatarData}`;
            }
        }
        
        return `
            <div class="review-card" style="animation-delay: ${index * 0.2}s;">
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${avatarSrc}" 
                             alt="${name}" 
                             class="reviewer-avatar" 
                             onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'">
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
    
    // Function to generate stars HTML
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    // Function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Removed mock home reviews fallback per request
    
    // Load home reviews when page loads
    loadHomeReviews();
    

    
    // Simple loading functions for home page
    function showPortfolioLoading() {
        if (portfolioLoading) portfolioLoading.style.display = 'flex';
        if (homePortfolioGrid) homePortfolioGrid.style.display = 'none';
    }
    
    function hidePortfolioLoading() {
        if (portfolioLoading) portfolioLoading.style.display = 'none';
        if (homePortfolioGrid) homePortfolioGrid.style.display = 'grid';
    }
    
    // Import portfolio functions from portfolio.js
    function slugify(text) {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    }
    
    function getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    // Home Portfolio: always fetch fresh
    const PORTFOLIO_FILTERS_API_URL = 'https://script.google.com/macros/s/AKfycbziQdfgsCewHNR_hSBu23W0Js7YH5JL7rOPrZERx5kwqCMeS3HUrMsZ74-gGK6hAaS3/exec';
    const PORTFOLIO_GRID_API_URL    = 'https://script.google.com/macros/s/AKfycbw0qIf4g5AfkBuDsywygYQJWYWo3BxVvCpRHGdGDjK0NaMa2A3TkAusCvnYoFeYbESvLg/exec';
    // Cache last payload to support live re-render on language toggle
    let lastHomePortfolioPayload = null;
    async function fetchHomePortfolio() {
        try {
            const [filtersResp, gridResp] = await Promise.all([
                fetch(PORTFOLIO_FILTERS_API_URL, { cache: 'no-store', keepalive: true }),
                fetch(PORTFOLIO_GRID_API_URL, { cache: 'no-store', keepalive: true })
            ]);
            if (!filtersResp.ok) throw new Error('Home portfolio filters fetch failed: ' + filtersResp.status);
            if (!gridResp.ok) throw new Error('Home portfolio grid fetch failed: ' + gridResp.status);
            const [filtersData, gridData] = await Promise.all([filtersResp.json(), gridResp.json()]);
            const payload = {
                categories: (filtersData && Array.isArray(filtersData.categories)) ? filtersData.categories : [],
                projects: (gridData && Array.isArray(gridData.projects)) ? gridData.projects : []
            };
            return payload;
        } catch (e) {
            console.error('[Home] Portfolio network hydrate failed:', e);
            throw e;
        }
    }

    async function loadHomePortfolioFresh() {
        showPortfolioLoading();
        try {
            const payload = await fetchHomePortfolio();
            lastHomePortfolioPayload = payload;
            renderHomePortfolioGrid(payload.projects, payload.categories);
        } catch (e) {
            console.error('[Home] Failed to load portfolio for home:', e);
            // Do nothing else; section will remain empty rather than show fallback content
        } finally {
            hidePortfolioLoading();
        }
    }
    
    function renderHomePortfolioGrid(items, categories) {
        if (!homePortfolioGrid) return;
        
        const randomItems = getRandomItems(items, 3);
        
        // Build category map
        const catMap = {};
        if (categories) {
            // Language-aware category title
            const lang = (function(){
                try { const v = localStorage.getItem('ospv_language'); return (v === 'EN' || v === 'FR') ? v : 'FR'; } catch(_) { return 'FR'; }
            })();
            categories.forEach(cat => { catMap[cat.id] = (lang === 'EN' ? (cat.titleEN || cat.titleFR) : (cat.titleFR || cat.titleEN)); });
        }
        
        homePortfolioGrid.innerHTML = '';
        
        randomItems.forEach(item => {
            const lang = (function(){
                try { const v = localStorage.getItem('ospv_language'); return (v === 'EN' || v === 'FR') ? v : 'FR'; } catch(_) { return 'FR'; }
            })();
            const catName = catMap[item.id_category] || (lang === 'EN' ? 'Unknown' : 'Inconnu');
            const catSlug = slugify(catName);
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'portfolio-item-page';
            itemDiv.setAttribute('data-category', catSlug);
            itemDiv.setAttribute('data-id_script', item.id_script);
            
            itemDiv.innerHTML = `
                <div class="portfolio-image-page">
                    <img src="${item.url_image}" alt="${(lang === 'EN' ? (item.nameEN || item.name) : (item.name || item.nameEN))}">
                    <span class="portfolio-tag">${catName}</span>
                    <div class="portfolio-overlay">
                        <div class="portfolio-info-page">
                            <h3 class="portfolio-title-page">${(lang === 'EN' ? (item.nameEN || item.name) : (item.name || item.nameEN))}</h3>
                            <p class="portfolio-year-page">${item.date}</p>
                        </div>
                    </div>
                </div>
            `;
            
            homePortfolioGrid.appendChild(itemDiv);
        });
        
        attachHomePortfolioItemHandlers();
    }

    // Live language re-render for home portfolio
    window.addEventListener('ospv:languageChanged', function() {
        if (lastHomePortfolioPayload && Array.isArray(lastHomePortfolioPayload.projects)) {
            renderHomePortfolioGrid(lastHomePortfolioPayload.projects, lastHomePortfolioPayload.categories || []);
        }
    });
    
    function attachHomePortfolioItemHandlers() {
        const portfolioItems = document.querySelectorAll('#home-portfolio-grid .portfolio-item-page');
        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                const title = this.querySelector('.portfolio-title-page').textContent;
                const year = this.querySelector('.portfolio-year-page').textContent;
                const idScript = this.getAttribute('data-id_script');
                
                localStorage.setItem('photoshoot_id_script', idScript);
                localStorage.setItem('photoshoot_name', title);
                localStorage.setItem('photoshoot_year', year);
                
                window.location.href = 'photoshoot.html';
            });
        });
    }
    
    // Start loading home portfolio (fresh)
    loadHomePortfolioFresh();
    
    // Contact form handling moved to contact.js
    
   
    
    // Navigation scroll effect
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.25)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.15)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }
    heroBackground = document.querySelector('.hero-background');
    
    // Add parallax effect to hero background
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            if (scrolled < window.innerHeight) {
                heroBackground.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Add loading animation
    window.addEventListener('load', function() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 1s ease-out';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }
    });
    
    // Add hover effects for better interactivity
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add form field focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
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
            }
        });
    }, observerOptions);
    
    // Observe offre items for animations
    const offreItems = document.querySelectorAll('.offre-card');
    offreItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
}); 