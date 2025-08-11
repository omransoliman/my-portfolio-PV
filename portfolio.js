    // Re-render when navigation (logo click) requests a refresh
    window.addEventListener('ospv:portfolioUpdated', async function() {
        try { console.log('[Portfolio] portfolioUpdated event — fetching fresh data'); } catch(_) {}
        showLoading();
        try {
            const payload = await fetchPortfolioFresh();
            currentCategories = payload.categories || [];
            currentItems = payload.projects || [];
            renderFilterButtons(currentCategories);
            attachFilterLogic();
            renderPortfolioGrid(currentItems, currentCategories);
            attachSortLogic();
        } catch (e) {
            try { console.error('[Portfolio] Event-driven fetch failed:', e); } catch(_) {}
        } finally {
            hideLoading();
        }
    });
    // Listener added later after function declarations
// FINAL WORKING SOLUTION - PORTFOLIO.JS
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio page loaded');

    // 1. Configuration
    const FILTERS_API_URL = 'https://script.google.com/macros/s/AKfycbziQdfgsCewHNR_hSBu23W0Js7YH5JL7rOPrZERx5kwqCMeS3HUrMsZ74-gGK6hAaS3/exec';
    const GRID_API_URL = 'https://script.google.com/macros/s/AKfycbw0qIf4g5AfkBuDsywygYQJWYWo3BxVvCpRHGdGDjK0NaMa2A3TkAusCvnYoFeYbESvLg/exec';
    
    // 2. DOM Elements
    const grid = document.querySelector('.portfolio-grid-page');
    const loadingContainer = document.getElementById('portfolio-loading');
    const filtersContainer = document.querySelector('.portfolio-filters');
    const sortBtn = document.getElementById('sort-btn');
    const sortDropdown = document.getElementById('sort-dropdown');
    
    // 3. State
    let currentItems = [];
    let currentCategories = [];
    let currentSortValue = 'default';
    // Language
    function getLang() {
        try {
            const v = localStorage.getItem('ospv_language');
            return (v === 'EN' || v === 'FR') ? v : 'FR';
        } catch(_) { return 'FR'; }
    }
    const pickLang = (fr, en) => (getLang() === 'EN' ? (en || fr) : (fr || en));

    // No IndexedDB usage — portfolio always fetched fresh

    // 4. Core Functions =============================================
    
    async function fetchData(url) {
        try {
            const response = await fetch(url, { cache: 'no-store', keepalive: true });
            if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
            const data = await response.json();
            console.log('Received data:', data);
            if (data && data.success === false) throw new Error(data.error || 'Invalid data format');
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    async function fetchPortfolioFresh() {
        try {
            try { console.log('[Portfolio][Fetch] starting', { filters: FILTERS_API_URL, grid: GRID_API_URL }); } catch(_) {}
            const [categoriesData, projectsData] = await Promise.all([
                fetchData(FILTERS_API_URL),
                fetchData(GRID_API_URL)
            ]);
            if (!categoriesData || !projectsData) throw new Error('Failed to load required data');
            const payload = {
                categories: categoriesData.categories || [],
                projects: projectsData.projects || []
            };
            return payload;
        } catch (e) {
            console.error('[Portfolio] network hydrate failed:', e);
            throw e;
        }
    }

    // Render filter buttons
    function renderFilterButtons(categories) {
        // Store the sort filter
        const sortFilter = filtersContainer.querySelector('.sort-filter');
        
        // Clear only the filter buttons, not the entire container
        const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.remove());
        
        // Always add 'All' button first
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.setAttribute('data-filter', 'all');
        allBtn.textContent = getLang() === 'EN' ? 'All' : 'Tous';
        filtersContainer.appendChild(allBtn);

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            const title = pickLang(cat.titleFR, cat.titleEN);
            btn.setAttribute('data-filter', slugify(title));
            btn.textContent = title;
            filtersContainer.appendChild(btn);
        });
    }

    // Render the portfolio grid
    function renderPortfolioGrid(items, categories) {
        grid.innerHTML = '';
        // Build a map for category id -> name
        const catMap = {};
        categories.forEach(cat => { catMap[cat.id] = pickLang(cat.titleFR, cat.titleEN); });

        // Get current sort criteria
        const sortedItems = sortItems(items, currentSortValue);

        sortedItems.forEach(item => {
            const catName = catMap[item.id_category] || (getLang() === 'EN' ? 'Unknown' : 'Inconnu');
            const catSlug = slugify(catName);

            // Create the item element
            const itemDiv = document.createElement('div');
            itemDiv.className = 'portfolio-item-page';
            itemDiv.setAttribute('data-category', catSlug);
            itemDiv.setAttribute('data-id_script', item.id_script); // for future use

            itemDiv.innerHTML = `
                <div class="portfolio-image-page">
                    <img src="${item.url_image}" alt="${pickLang(item.name, item.nameEN || item.name)}">
                    <span class="portfolio-tag">${catName}</span>
                    <div class="portfolio-overlay">
                        <div class="portfolio-info-page">
                            <h3 class="portfolio-title-page">${pickLang(item.name, item.nameEN || item.name)}</h3>
                            <p class="portfolio-year-page">${item.date}</p>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(itemDiv);
        });

        // Re-attach click handlers and animation observers if needed
        attachPortfolioItemHandlers();
        attachIntersectionObservers();
    }


    // Attach click handlers to portfolio items
    function attachPortfolioItemHandlers() {
        const portfolioItems = document.querySelectorAll('.portfolio-item-page');
        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px)';
                }, 150);
                const title = this.querySelector('.portfolio-title-page').textContent;
                const year = this.querySelector('.portfolio-year-page').textContent;
                const idScript = this.getAttribute('data-id_script');
                // Store info for photoshoot page
                localStorage.setItem('photoshoot_id_script', idScript);
                localStorage.setItem('photoshoot_name', title);
                localStorage.setItem('photoshoot_year', year);
                // Redirect to photoshoot page
                window.location.href = 'photoshoot.html';
            });
        });
    }

    // Attach intersection observers for animation
    function attachIntersectionObservers() {
        const portfolioItems = document.querySelectorAll('.portfolio-item-page');
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
        portfolioItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            observer.observe(item);
        });
    }



    // Sort items based on selected criteria
    function sortItems(items, sortCriteria) {
        const sortedItems = [...items];
        
        switch(sortCriteria) {
            case 'name-asc':
                sortedItems.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedItems.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'year-asc':
                sortedItems.sort((a, b) => {
                    const yearA = parseInt(a.date) || 0;
                    const yearB = parseInt(b.date) || 0;
                    return yearA - yearB;
                });
                break;
            case 'year-desc':
                sortedItems.sort((a, b) => {
                    const yearA = parseInt(a.date) || 0;
                    const yearB = parseInt(b.date) || 0;
                    return yearB - yearA;
                });
                break;
            default:
                // Keep original order
                break;
        }
        
        return sortedItems;
    }

    // Attach filter logic to buttons
    function attachFilterLogic() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                const portfolioItems = document.querySelectorAll('.portfolio-item-page');
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || slugify(category) === filterValue) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.6s ease-out';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Attach sort logic
    function attachSortLogic() {
        // Toggle dropdown on button click
        sortBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sortDropdown.classList.toggle('active');
        });

        // Handle sort option clicks
        const sortOptions = document.querySelectorAll('.sort-option');
        sortOptions.forEach(option => {
            option.addEventListener('click', function() {
                const sortValue = this.getAttribute('data-sort');
                currentSortValue = sortValue;
                
                // Update active state
                sortOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Close dropdown
                sortDropdown.classList.remove('active');
                
                // Re-render grid
                renderPortfolioGrid(currentItems, currentCategories);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!sortBtn.contains(e.target) && !sortDropdown.contains(e.target)) {
                sortDropdown.classList.remove('active');
            }
        });
    }

    // 5. Helper Functions ===========================================
    
    function ensureHttps(url) {
        if (!url) return '';
        return url.startsWith('http') ? url : `https://${url.replace(/^\/\//, '')}`;
    }

    function animateProject(element, index) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    }

    function slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
    }

    function showError(message) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #fff;">
                <i class="fas fa-exclamation-triangle"></i>
                ${message}
            </div>
        `;
    }

    function showLoading() {
        if (loadingContainer) loadingContainer.style.display = 'flex';
        if (grid) grid.style.display = 'none';
    }

    function hideLoading() {
        if (loadingContainer) loadingContainer.style.display = 'none';
        if (grid) grid.style.display = 'grid';
    }

    // 6. Initialization =============================================
    
    async function initialize() {
        showLoading();
        try {
            const payload = await fetchPortfolioFresh();
            currentCategories = payload.categories || [];
            currentItems = payload.projects || [];
            console.log('Loaded categories:', currentCategories);
            console.log('Loaded projects:', currentItems);
            renderFilterButtons(currentCategories);
            attachFilterLogic();
            renderPortfolioGrid(currentItems, currentCategories);
            attachSortLogic();
        } catch (error) {
            console.error('Initialization error:', error);
            showError('Failed to load portfolio. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    // Re-render on language change or portfolio update
    initialize();

    // Re-render on language change
    window.addEventListener('ospv:languageChanged', function() {
        try {
            renderFilterButtons(currentCategories);
            attachFilterLogic();
            renderPortfolioGrid(currentItems, currentCategories);
        } catch (_) {}
    });
});