// Navigation Bar JavaScript - Shared across pages

document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation loaded');
    // Old simple hamburger handlers removed in favor of overlay-based setup below

    // --- Global About/Reviews/Offers/Portfolio caching and OSPV logo click refresh (bind on load, not on first click) ---
    const ABOUT_API_URL = 'https://script.google.com/macros/s/AKfycbzQeunzlj6NL-INBKNA-P-jZLnygG-r6wO53tykV2tVnQ6WdbkFB9EpjCtR8f5n7Vs/exec';
    // localStorage caches removed; IDB is source of truth
    const OFFERS_API_URL = 'https://script.google.com/macros/s/AKfycbw0Tbcw-MOGB_y1aIERZoerh7mY3NBeOA8xcJIpHagGEOmkJVpzpI2oDsbvuiuadxDhfw/exec';
    const REVIEWS_API_URL = 'https://script.google.com/macros/s/AKfycbxS84YQrgPQHzJ5Nu7u2wKdMPddIONrTuAtQp0EEEfamgPwSUmvSYSXpWnKcPAuXXg/exec';
    // localStorage caches removed; IDB is source of truth
    // Portfolio endpoints
    const PORTFOLIO_FILTERS_API_URL = 'https://script.google.com/macros/s/AKfycbziQdfgsCewHNR_hSBu23W0Js7YH5JL7rOPrZERx5kwqCMeS3HUrMsZ74-gGK6hAaS3/exec';
    const PORTFOLIO_GRID_API_URL    = 'https://script.google.com/macros/s/AKfycbw0qIf4g5AfkBuDsywygYQJWYWo3BxVvCpRHGdGDjK0NaMa2A3TkAusCvnYoFeYbESvLg/exec';

    // No IndexedDB usage — all data fetched fresh
    const IDB_DB_NAME = null;
    // Language preference key (localStorage is fine for simple prefs)
    const LANG_KEY = 'ospv_language'; // 'EN' | 'FR'

    // No IndexedDB helpers — removed

    async function fetchAboutAndCache() {
        try {
            try { console.debug('[About][Fetch] starting', { url: ABOUT_API_URL }); } catch(_) {}
            const resp = await fetch(ABOUT_API_URL, { cache: 'no-store', keepalive: true });
            if (!resp.ok) throw new Error('About fetch failed: ' + resp.status);
            const data = await resp.json();
            if (data && (data.about_title_EN || data.about_title_FR)) {
                try { console.debug('[About][Fetch] received'); } catch(_) {}
            }
        } catch (e) {
            console.warn('About prefetch error:', e);
        }
    }

    function ensureAboutCached() { fetchAboutAndCache(); }

    async function fetchReviewsAndCache() {
        try {
            try { console.debug('[Reviews][Fetch] starting', { url: REVIEWS_API_URL }); } catch(_) {}
            const resp = await fetch(REVIEWS_API_URL, { cache: 'no-store', keepalive: true });
            if (!resp.ok) throw new Error('Reviews fetch failed: ' + resp.status);
            const data = await resp.json();
            if (data && Array.isArray(data.reviews)) {
                try { console.debug('[Reviews][Fetch] received', { count: data.reviews.length, lastUpdated: data.lastUpdated }); } catch(_) {}
            }
        } catch (e) {
            console.warn('Reviews prefetch error:', e);
        }
    }

    function ensureReviewsCached() { fetchReviewsAndCache(); }

    // Offers: intentionally not cached in IDB. Always fetch on demand in pages that need it.

    async function fetchPortfolioAndCache() {
        try {
            try { console.debug('[Portfolio][Fetch] starting', { filters: PORTFOLIO_FILTERS_API_URL, grid: PORTFOLIO_GRID_API_URL }); } catch(_) {}
            const [filtersResp, gridResp] = await Promise.all([
                fetch(PORTFOLIO_FILTERS_API_URL, { cache: 'no-store', keepalive: true }),
                fetch(PORTFOLIO_GRID_API_URL, { cache: 'no-store', keepalive: true })
            ]);
            if (!filtersResp.ok) throw new Error('Portfolio filters fetch failed: ' + filtersResp.status);
            if (!gridResp.ok) throw new Error('Portfolio grid fetch failed: ' + gridResp.status);
            const [filtersData, gridData] = await Promise.all([filtersResp.json(), gridResp.json()]);
            if (filtersData && gridData && filtersData.categories && gridData.projects) {
                try { console.debug('[Portfolio][Fetch] received', { cats: filtersData.categories.length, items: gridData.projects.length }); } catch(_) {}
            }
        } catch (e) {
            console.warn('Portfolio prefetch error:', e);
        }
    }

    function ensurePortfolioCached() { fetchPortfolioAndCache(); }

    // Do not prefetch on every page load anymore.
    // Pages themselves load from IndexedDB and will fetch if empty.
    // Prefetch is triggered only on logo click via ospvRefreshAndGo.

    // No global staleness check — always fetch fresh when needed

    // Offers store removed in schema v9; no cleanup needed at runtime.

    // -------- Global Navbar I18n --------
    const NAV_LABELS = {
        EN: {
            home: 'HOME',
            portfolio: 'PORTFOLIO',
            offers: 'OFFERS',
            about: 'ABOUT',
            contact: 'CONTACT',
            reviews: 'REVIEWS'
        },
        FR: {
            home: 'ACCUEIL',
            portfolio: 'PORTFOLIO',
            offers: 'OFFRES',
            about: 'À PROPOS',
            contact: 'CONTACT',
            reviews: 'AVIS'
        }
    };

    function applyNavI18n() {
        try {
            const lang = (window.ospvGetLanguage ? window.ospvGetLanguage() : (document.querySelector('.nav-language span')?.textContent || 'FR')).toUpperCase();
            document.querySelectorAll('.nav-menu [data-i18n]').forEach((a) => {
                const key = a.getAttribute('data-i18n');
                const txt = NAV_LABELS[lang] && NAV_LABELS[lang][key];
                if (txt) a.textContent = txt;
            });
        } catch(_) {}
    }

    document.addEventListener('DOMContentLoaded', applyNavI18n);
    window.addEventListener('ospv:languageChanged', applyNavI18n);

    // -------- Page I18n (Privacy Policy and others using data-i18n) --------
    // Only define non-nav keys to avoid collisions. EN is default in DOM; we set FR.
    const PAGE_LABELS = {
        FR: {
            'pp.title': 'POLITIQUE DE CONFIDENTIALITÉ',
            'pp.dataCollection.title': 'Collecte des données',
            'pp.dataCollection.intro': 'Lorsque vous soumettez votre e-mail via notre formulaire de contact, nous collectons :',
            'pp.dataCollection.items.name': 'Votre nom',
            'pp.dataCollection.items.email': 'Adresse e-mail',
            'pp.dataCollection.items.language': 'Langue préférée',
            'pp.dataCollection.items.additional': 'Toute information supplémentaire fournie volontairement',
            'pp.use.title': 'Utilisation de vos données',
            'pp.use.intro': 'En tant que photographe, j’utilise vos informations pour :',
            'pp.use.items.sendPhotos': 'Vous envoyer les photos prises de vous',
            'pp.use.items.notifyExhibitions': 'Vous informer des prochaines expositions',
            'pp.use.items.newsletters': 'Partager des newsletters occasionnelles concernant mon travail',
            'pp.use.items.respond': 'Répondre à vos demandes',
            'pp.protection.title': 'Protection des données',
            'pp.protection.intro': 'Votre confidentialité est importante pour moi. Je mets en place :',
            'pp.protection.items.secureStorage': 'Un stockage sécurisé de toutes les données personnelles',
            'pp.protection.items.noSharing': 'Aucun partage avec des tiers sans consentement',
            'pp.protection.items.updates': 'Des mises à jour régulières de sécurité',
            'pp.rights.title': 'Vos droits',
            'pp.rights.intro': 'Vous avez le droit de :',
            'pp.rights.items.correct': 'Demander la correction des informations inexactes',
            'pp.rights.items.unsubscribe': 'Vous désabonner des communications à tout moment',
            'pp.contact.title': 'Coordonnées',
            'pp.contact.intro': 'Pour toute question relative à la confidentialité, veuillez me contacter à :',
            'pp.lastUpdatedLabel': 'Dernière mise à jour :',
            'pp.lastUpdatedDate': 'Août 2025'
        }
    };

    function applyPageI18n() {
        try {
            const lang = (window.ospvGetLanguage ? window.ospvGetLanguage() : (document.querySelector('.nav-language span')?.textContent || 'FR')).toUpperCase();
            // Apply only known page keys to avoid touching nav (nav handled above)
            const dict = PAGE_LABELS[lang];
            if (!dict) return; // EN defaults already in DOM
            document.querySelectorAll('[data-i18n]').forEach((el) => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) el.textContent = dict[key];
            });
            // Set html lang
            const html = document.documentElement; if (html) html.setAttribute('lang', lang.toLowerCase());
        } catch(_) {}
    }

    document.addEventListener('DOMContentLoaded', applyPageI18n);
    window.addEventListener('ospv:languageChanged', applyPageI18n);

    // -------- Mobile Navigation Toggle with Background Blur --------
    (function setupMobileNav() {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        const navRight = document.querySelector('.nav-right');
        let mobileExtra; // container injected into nav-menu
        if (!navMenu || !hamburger) return;

        // Create overlay once
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
        }

        function openNav() {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('nav-open');
            hamburger.setAttribute('aria-expanded', 'true');
            // Inject language + social into the fullscreen menu
            try {
                if (navRight && !mobileExtra) {
                    mobileExtra = document.createElement('li');
                    mobileExtra.className = 'nav-extra-mobile';
                    const clone = navRight.cloneNode(true);
                    clone.style.display = ''; // reset any display
                    mobileExtra.appendChild(clone);
                    // Append at end of the menu
                    const ul = navMenu;
                    ul.appendChild(mobileExtra);
                    // Hide original to avoid duplicate
                    navRight.style.visibility = 'hidden';
                }
            } catch(_) {}
        }

        function closeNav() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-open');
            hamburger.setAttribute('aria-expanded', 'false');
            // Remove injected mobile extras and restore original
            try {
                if (mobileExtra && mobileExtra.parentNode) {
                    mobileExtra.parentNode.removeChild(mobileExtra);
                }
                mobileExtra = null;
                if (navRight) navRight.style.visibility = '';
            } catch(_) {}
        }

        function toggleNav(e) {
            if (e) e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeNav();
            } else {
                openNav();
            }
        }

        hamburger.setAttribute('aria-controls', 'primary-navigation');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.id = navMenu.id || 'primary-navigation';

        // Support both click and touch (iOS Safari quirks)
        hamburger.addEventListener('click', toggleNav);
        hamburger.addEventListener('touchstart', (e) => { e.preventDefault(); toggleNav(e); }, { passive: false });
        overlay.addEventListener('click', closeNav);
        overlay.addEventListener('touchstart', (e) => { e.preventDefault(); closeNav(); }, { passive: false });

        // Close when clicking a nav link (for single-page or navigation)
        navMenu.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (a) {
                closeNav();
            }
        });

        // Close on ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNav();
        });

        // Close if resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeNav();
        });
    })();

    // Expose a global function for inline onclick usage
    window.ospvRefreshAndGo = async function(el) {
        try { console.log('[LogoClick] ospvRefreshAndGo invoked'); } catch(_) {}
        const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
        let prefetchAll = null;
        try {
            // Build prefetch list dynamically; Reviews only for Home/Reviews
            const pathname = (window.location && window.location.pathname) || '';
            const current = (window.currentPage || '').toLowerCase();
            const hrefTarget = (el && el.getAttribute) ? (el.getAttribute('href') || 'index.html') : 'index.html';
            const targetIsHome = /index\.html$/.test(hrefTarget) || hrefTarget === '/' || hrefTarget === '';
            const targetIsReviews = /reviews\.html$/.test(hrefTarget);
            const isHome = current === 'home' || /(^|\/)index\.html$/.test(pathname) || pathname === '/';
            const isReviews = current === 'reviews' || /reviews\.html$/.test(pathname);
            const tasks = [];
            try { console.log('[LogoClick] Prefetch plan:', { current, pathname, hrefTarget, isHome, isReviews, targetIsHome, targetIsReviews }); } catch(_) {}
            // About
            try { console.log('[LogoClick] Queue About prefetch'); } catch(_) {}
            tasks.push(fetchAboutAndCache());
            // Portfolio
            try { console.log('[LogoClick] Queue Portfolio prefetch'); } catch(_) {}
            tasks.push(fetchPortfolioAndCache());
            if (isHome || isReviews || targetIsHome || targetIsReviews) {
                try { console.log('[LogoClick] Queue Reviews prefetch'); } catch(_) {}
                tasks.push(fetchReviewsAndCache());
            }
            prefetchAll = Promise.allSettled(tasks);
            const winner = await Promise.race([prefetchAll, timeout]);
            try { console.log('Logo prefetch winner (inline):', winner); } catch (_) {}
        } catch (_) {}
        const href = (el && el.getAttribute) ? (el.getAttribute('href') || 'index.html') : 'index.html';
        const isOnIndex = /(^|\/)index\.html$/.test(window.location.pathname) || window.location.pathname === '/' || window.currentPage === 'Home';
        const isTargetIndex = /index\.html$/.test(href) || href === '/' || href === '';
        if (isOnIndex && isTargetIndex) {
            // Stay on homepage: wait briefly for prefetch, then refresh slideshow and notify portfolio UI
            try {
                try { console.log('[LogoClick] Staying on Home: waiting for prefetch (bounded)'); } catch(_) {}
                if (prefetchAll) {
                    await Promise.race([prefetchAll, timeout]);
                } else {
                    try { console.log('[LogoClick] No prefetch promise available'); } catch(_) {}
                }
            } catch(_) {}
            try {
                try { console.log('[LogoClick] Dispatch slideshow refresh'); } catch(_) {}
                window.dispatchEvent(new CustomEvent('ospv:refreshSlideshow'));
            } catch(_) {}
            try {
                try { console.log('[LogoClick] Dispatch portfolio update event'); } catch(_) {}
                window.dispatchEvent(new CustomEvent('ospv:portfolioUpdated'));
            } catch(_) {}
            // Also scroll to top for a fresh feel
            try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(_) {}
            return false;
        }
        try { console.log('[LogoClick] Navigating to:', href); } catch(_) {}
        window.location.href = href;
        return false; // prevent default when used inline
    };
    
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
    
    // Active navigation link management
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Set active link based on current page
    function setActiveNavLink() {
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage.includes('portfolio') && href.includes('portfolio')) ||
                (currentPage.includes('index') && href.includes('index'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Initialize active link
    setActiveNavLink();
    
    // Language selector functionality: toggle and persist to localStorage
    (function setupLanguageSelector() {
        const container = document.querySelector('.nav-language');
        const span = container ? container.querySelector('span') : null;
        if (!container || !span) return;

        // Initialize from storage (default FR)
        let lang = 'FR';
        try {
            const stored = localStorage.getItem(LANG_KEY);
            if (stored === 'EN' || stored === 'FR') lang = stored;
        } catch(_) {}
        span.textContent = lang;

        function setLanguage(next) {
            if (next !== 'EN' && next !== 'FR') return;
            span.textContent = next;
            try { localStorage.setItem(LANG_KEY, next); } catch(_) {}
            // Notify listeners
            try {
                window.dispatchEvent(new CustomEvent('ospv:languageChanged', { detail: { lang: next } }));
            } catch(_) {}
        }

        // Avoid double-toggling: if inline onclick is present, do not bind another listener
        const hasInlineOnclick = !!container.getAttribute('onclick');
        if (!hasInlineOnclick) {
            container.addEventListener('click', function(e) {
                // Ensure we control propagation to avoid duplicate handlers elsewhere
                try { e.stopPropagation(); } catch(_) {}
                const current = span.textContent && span.textContent.trim().toUpperCase() === 'EN' ? 'EN' : 'FR';
                const next = current === 'EN' ? 'FR' : 'EN';
                setLanguage(next);
            });
        }
    })();
    // Expose simple global helpers for inline onclick usage
    window.ospvGetLanguage = function() {
        try {
            const stored = localStorage.getItem(LANG_KEY);
            return (stored === 'EN' || stored === 'FR') ? stored : 'FR';
        } catch(_) { return 'FR'; }
    };
    window.ospvSetLanguage = function(next) {
        if (next !== 'EN' && next !== 'FR') return false;
        try { localStorage.setItem(LANG_KEY, next); } catch(_) {}
        const span = document.querySelector('.nav-language span');
        if (span) span.textContent = next;
        try { window.dispatchEvent(new CustomEvent('ospv:languageChanged', { detail: { lang: next } })); } catch(_) {}
        return false;
    };
    window.ospvToggleLanguage = function() {
        const current = (document.querySelector('.nav-language span')?.textContent || window.ospvGetLanguage()).toUpperCase();
        const next = current === 'EN' ? 'FR' : 'EN';
        return window.ospvSetLanguage(next);
    };
    
    // Social link functionality
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add any social link specific functionality here
            console.log('Social link clicked:', this.href);
        });
    });
}); 