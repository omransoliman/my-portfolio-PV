        // slideshow.js - Updated for new Google Sheet structure
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        apiUrl: 'https://script.google.com/macros/s/AKfycbx1ukozReeTJ1CHYrYio5Z2kLnB2GCMbVBic8XkjSmj0MMgZSrp1JrIosrIr0N9QLD2aA/exec', // Replace with your deployed URL
        containerSelector: '.hero', // Matches your hero section
        interval: 5000, // 5 seconds between slides
        transitionDuration: 1000, // 1 second transition
        fallbackImages: [
            'https://picflow.media/images/resized/1920x1080q85/0e6daebb-cf96-4e13-a6c3-00bc0d8bf2a2.jpg',
            'https://picflow.media/images/resized/1920x1080q85/d44b2f06-c68a-4980-8c01-170732411164.webp'
        ],
        fallbackTitles: [
            'CAPTURE LA VIE. LA BEAUTÉ. L\'AMOUR.',
            'CAPTURE LA VIE. LA BEAUTÉ. L\'AMOUR.'
        ],
        fallbackSubtitles: [
            'PHOTOS DES MEILLEURS MOMENTS DE LA VIE',
            'PHOTOS DES MEILLEURS MOMENTS DE LA VIE'
        ],
        // Language is resolved from localStorage('ospv_language') when rendering
    };

    // State variables
    let currentIndex = 0;
    let isFirstLayer = true;
    let slideshowData = null;
    let isDataLoaded = false;
    let intervalId = null;
    // No IndexedDB usage — slideshow always fetched fresh

    // DOM elements
    const container = document.querySelector(config.containerSelector);
    let background1, background2, titleElement, subtitleElement;

    // Initialize the slideshow
    function init() {
        if (!container) {
            console.error('Slideshow container not found');
            return;
        }

        // Create DOM structure if it doesn't exist
        if (!container.querySelector('.hero-background-1')) {
            container.innerHTML = `
                <div class="hero-background hero-background-1"></div>
                <div class="hero-background hero-background-2"></div>
                <div class="hero-content">
                    <h1 class="hero-title"></h1>
                    <p class="hero-subtitle"></p>
                </div>
            `;
        }

        // Cache elements
        background1 = container.querySelector('.hero-background-1');
        background2 = container.querySelector('.hero-background-2');
        titleElement = container.querySelector('.hero-title');
        subtitleElement = container.querySelector('.hero-subtitle');

        // Set initial styles
        background1.style.opacity = '1';
        background2.style.opacity = '0';
        background1.style.transition = `opacity ${config.transitionDuration}ms ease-in-out`;
        background2.style.transition = `opacity ${config.transitionDuration}ms ease-in-out`;

        // Always fetch fresh
        loadSlideshowFresh().then(() => {
            startSlideshow();
        }).catch(error => {
            console.error('Error initializing slideshow:', error);
            startSlideshow(); // Start with fallback data
        });
    }

    // Language helpers
    function getLang() {
        try {
            const v = localStorage.getItem('ospv_language');
            return (v === 'EN' || v === 'FR') ? v : 'FR';
        } catch(_) { return 'FR'; }
    }

    // Fetch from network
    async function fetchSlideshowFresh() {
        if (!config.apiUrl) return [];
        try {
            const response = await fetch(config.apiUrl, { cache: 'no-store', keepalive: true });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data && Array.isArray(data)) {
                const filtered = data.filter(item =>
                    item.id && item.url_image && (item.textEN || item.textFR) && (item.subtextEN || item.subtextFR)
                );
                return filtered;
            }
            return [];
        } catch (error) {
            console.error('Error fetching slideshow data:', error);
            return [];
        }
    }

    async function loadSlideshowFresh() {
        try {
            const list = await fetchSlideshowFresh();
            if (list && list.length) {
                slideshowData = list;
                isDataLoaded = true;
            }
        } catch (e) {
            // keep fallback
        }
    }

    // Get current data (either from IDB/network or fallback)
    function getCurrentData() {
        if (isDataLoaded && slideshowData && slideshowData.length > 0) {
            return slideshowData;
        } else {
            // Return fallback data in same format
            return config.fallbackImages.map((url, index) => ({
                url_image: url,
                textEN: config.fallbackTitles[index] || config.fallbackTitles[0],
                textFR: config.fallbackTitles[index] || config.fallbackTitles[0],
                subtextEN: config.fallbackSubtitles[index] || config.fallbackSubtitles[0],
                subtextFR: config.fallbackSubtitles[index] || config.fallbackSubtitles[0]
            }));
        }
    }

    // Update slide content (language-aware)
    function updateContent(index) {
        const currentData = getCurrentData();
        const currentItem = currentData[index % currentData.length];

        if (titleElement && subtitleElement) {
            const lang = getLang();
            const title = (lang === 'EN' ? (currentItem.textEN || currentItem.textFR) : (currentItem.textFR || currentItem.textEN)) || '';
            const sub = (lang === 'EN' ? (currentItem.subtextEN || currentItem.subtextFR) : (currentItem.subtextFR || currentItem.subtextEN)) || '';
            titleElement.textContent = title;
            subtitleElement.textContent = sub;
        }
    }

    // Change to next slide
    function changeSlide() {
        const currentData = getCurrentData();
        if (!currentData || currentData.length === 0) return;

        currentIndex = (currentIndex + 1) % currentData.length;
        const currentItem = currentData[currentIndex];

        if (background1 && background2) {
            const currentLayer = isFirstLayer ? background1 : background2;
            const nextLayer = isFirstLayer ? background2 : background1;

            // Set the new image on the hidden layer
            nextLayer.style.backgroundImage = `url('${currentItem.url_image}')`;
            
            // Update content
            updateContent(currentIndex);

            // Crossfade
            currentLayer.style.opacity = '0';
            nextLayer.style.opacity = '1';

            // Switch layers for next transition
            isFirstLayer = !isFirstLayer;
        }
    }

    // Start the slideshow
    function startSlideshow() {
        // Set initial slide
        const initialData = getCurrentData();
        if (initialData.length > 0) {
            background1.style.backgroundImage = `url('${initialData[0].url_image}')`;
            updateContent(0);
        }

        // Start interval
        intervalId = setInterval(() => {
            changeSlide();
        }, config.interval);
    }

    // Stop the slideshow
    function stopSlideshow() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Refresh the slideshow: fetch latest data, reset state, and restart
    async function refreshSlideshow() {
        try {
            stopSlideshow();
            // Force network fetch
            const fresh = await fetchSlideshowFresh();
            if (fresh && fresh.length) {
                slideshowData = fresh;
                isDataLoaded = true;
            }
            // Reset state
            currentIndex = 0;
            isFirstLayer = true;
            if (background1 && background2) {
                background1.style.opacity = '1';
                background2.style.opacity = '0';
            }
            startSlideshow();
        } catch (e) {
            console.warn('[Slideshow] refresh failed:', e);
            // Fall back to restarting with whatever data we have
            try { startSlideshow(); } catch(_) {}
        }
    }

    // Initialize the slideshow
    init();

    // Expose controls to window (optional)
    window.slideshow = {
        start: startSlideshow,
        stop: stopSlideshow,
        next: changeSlide,
        setLanguage: function() {
            // re-render current content with new language
            updateContent(currentIndex);
        },
        refresh: refreshSlideshow
    };

    // Re-render texts on language change
    window.addEventListener('ospv:languageChanged', function() {
        updateContent(currentIndex);
    });

    // Listen for global refresh trigger from navigation logo click
    window.addEventListener('ospv:refreshSlideshow', function() {
        refreshSlideshow();
    });
});