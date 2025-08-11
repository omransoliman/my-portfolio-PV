document.addEventListener('DOMContentLoaded', function () {
    console.log('Offers page loaded');

    const offersGrid = document.getElementById('offers-grid');
    const OFFERS_API_URL = 'https://script.google.com/macros/s/AKfycbw0Tbcw-MOGB_y1aIERZoerh7mY3NBeOA8xcJIpHagGEOmkJVpzpI2oDsbvuiuadxDhfw/exec';

    // No IndexedDB usage

    // Language helper
    function getLang() {
        try {
            const v = localStorage.getItem('ospv_language');
            return (v === 'EN' || v === 'FR') ? v : 'FR';
        } catch(_) { return 'FR'; }
    }

    // Keep last offers for live re-render on language change
    let lastOffers = [];

    // Removed old IndexedDB helpers (open/get/put)

    function showLoading() {
        const lang = getLang();
        const text = (lang === 'EN') ? 'Loading offers...' : 'Chargement des offres...';
        offersGrid.innerHTML = `
            <div class="offers-loading">
                <div class="loading-spinner"></div>
                <p class="loading-text">${text}</p>
            </div>
        `;
    }

    function showError() {
        const lang = getLang();
        const title = (lang === 'EN') ? 'Unable to load offers' : 'Impossible de charger les offres';
        const desc = (lang === 'EN')
            ? 'Please try refreshing the page or contact us if the problem persists.'
            : 'Veuillez essayer d’actualiser la page ou nous contacter si le problème persiste.';
        offersGrid.innerHTML = `
            <div class="offers-error">
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>${title}</h3>
                    <p>${desc}</p>
                </div>
            </div>
        `;
    }

    function showEmpty() {
        const lang = getLang();
        const title = (lang === 'EN') ? 'No offers available' : 'Aucune offre disponible';
        const desc = (lang === 'EN')
            ? 'Check back soon for exciting photography offers and exclusive deals!'
            : 'Revenez bientôt pour découvrir de nouvelles offres et promotions !';
        offersGrid.innerHTML = `
            <div class="offers-empty">
                <div class="empty-message">
                    <i class="fas fa-camera"></i>
                    <h3>${title}</h3>
                    <p>${desc}</p>
                </div>
            </div>
        `;
    }

    function createOfferCard(offer) {
        const lang = getLang();
        const pick = (fr, en) => (lang === 'EN' ? (en || fr) : (fr || en));
        const details = [
            pick(offer.Line1_FR, offer.Line1_EN),
            pick(offer.Line2_FR, offer.Line2_EN),
            pick(offer.Line3_FR, offer.Line3_EN),
            pick(offer.Line4_FR, offer.Line4_EN),
            pick(offer.Line5_FR, offer.Line5_EN),
            pick(offer.Line6_FR, offer.Line6_EN)
        ].filter(line => line && String(line).trim() !== '');

        const detailsHTML = details.map(detail =>
            `<div class="offer-detail">${detail}</div>`
        ).join('');

        const title = pick(offer.Title_FR, offer.Title_EN) || '';
        const desc  = pick(offer.Description_FR, offer.Description_EN) || '';
        const waMsg = pick(offer['Whatsapp Message_FR'], offer['Whatsapp Message_EN']) || '';
        const emailSubject = pick(offer['Email Subject_FR'], offer['Email Subject_EN']) || '';
        const emailBody = pick(offer['Email Body_FR'], offer['Email Body_EN']) || '';
        const shareMsg = pick(offer['Share Message_FR'], offer['Share Message_EN']) || '';

        const tooltipWhatsApp = lang === 'EN' ? 'WhatsApp' : 'WhatsApp';
        const tooltipEmail    = lang === 'EN' ? 'Email' : 'Email';
        const tooltipShare    = lang === 'EN' ? 'Share' : 'Partager';

        return `
            <div class="offer-card" data-offer-id="${offer.id}">
                <div class="offer-image-container">
                    <img src="${offer.Photo}" alt="${title}" class="offer-image" loading="lazy">
                    <div class="offer-title-overlay">
                        <h3 class="offer-title">${title}</h3>
                    </div>
                </div>
                <div class="offer-content">
                    <p class="offer-description">${desc}</p>
                    <div class="offer-details">${detailsHTML}</div>
                    <div class="offer-footer">
                        <div class="offer-price">${offer.Price}</div>
                        <div class="offer-actions">
                            <a href="#" class="offer-btn whatsapp" data-tooltip="${tooltipWhatsApp}" data-whatsapp="${waMsg}" title="${tooltipWhatsApp}">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                            <a href="#" class="offer-btn email" data-tooltip="${tooltipEmail}" data-email-subject="${emailSubject}" data-email-body="${emailBody}" title="${tooltipEmail}">
                                <i class="fas fa-envelope"></i>
                            </a>
                            <a href="#" class="offer-btn share" data-tooltip="${tooltipShare}" data-share="${shareMsg}" title="${tooltipShare}">
                                <i class="fas fa-share-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function groupOffersByLocation(offers) {
        const grouped = {};
        offers.forEach(offer => {
            const location = offer.Location || 'Other Locations';
            if (!grouped[location]) grouped[location] = [];
            grouped[location].push(offer);
        });
        return grouped;
    }

    function createLocationSection(location, offers) {
        const offersHTML = offers.map(createOfferCard).join('');
        return `
            <div class="location-section">
                <h2 class="location-title">📍 ${location}</h2>
                <div class="offers-grid">${offersHTML}</div>
            </div>
        `;
    }

    function renderOffers(offers) {
        console.log('Rendering offers:', offers);

        if (!offers || offers.length === 0) return showEmpty();

        const activeOffers = offers.filter(offer => {
            const val = String(offer.action || '').toLowerCase();
            return val === 'true';
        });

        if (activeOffers.length === 0) return showEmpty();

        const groupedOffers = groupOffersByLocation(activeOffers);
        const sectionsHTML = Object.entries(groupedOffers)
            .map(([location, group]) => createLocationSection(location, group))
            .join('');

        offersGrid.innerHTML = sectionsHTML;
        addOfferEventListeners();
    }

    function addOfferEventListeners() {
        document.querySelectorAll('.offer-btn.whatsapp').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const message = encodeURIComponent(this.dataset.whatsapp);
                window.open(`https://wa.me/33625965257?text=${message}`, '_blank');
            });
        });

        document.querySelectorAll('.offer-btn.email').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const subject = encodeURIComponent(this.dataset.emailSubject);
                const body = encodeURIComponent(this.dataset.emailBody);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            });
        });

        document.querySelectorAll('.offer-btn.share').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const shareData = {
                    title: 'Photography Offer',
                    text: this.dataset.share,
                    url: window.location.href
                };
                if (navigator.share) {
                    navigator.share(shareData).catch(console.error);
                } else {
                    const shareText = `${shareData.text} ${shareData.url}`;
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(shareText).then(() => {
                            const original = this.innerHTML;
                            this.innerHTML = '<i class="fas fa-check"></i>';
                            setTimeout(() => this.innerHTML = original, 2000);
                        });
                    } else {
                        alert('Share link copied: ' + shareText);
                    }
                }
            });
        });
    }

    async function fetchOffersAndHydrate() {
        try {
            try { console.debug('[Offers][Fetch] starting', { url: OFFERS_API_URL }); } catch(_) {}
            const res = await fetch(OFFERS_API_URL, { cache: 'no-store', keepalive: true });
            if (!res.ok) throw new Error('Failed to fetch offers: ' + res.status);
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            // No longer storing offers in IndexedDB per requirement
            return list;
        } catch (err) {
            console.error('[Offers] network fetch failed:', err);
            throw err;
        }
    }

    async function loadOffers() {
        showLoading();
        try {
            const list = await fetchOffersAndHydrate();
            lastOffers = list;
            renderOffers(list);
        } catch (err) {
            showError();
        }
    }

    // Start
    loadOffers();

    // Re-render on language change
    window.addEventListener('ospv:languageChanged', function() {
        if (lastOffers && lastOffers.length) {
            renderOffers(lastOffers);
        }
    });

    window.addEventListener('load', function () {
        document.body.style.opacity = '1';
    });

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    document.addEventListener('error', function (e) {
        if (e.target.tagName === 'IMG' && e.target.classList.contains('offer-image')) {
            e.target.src = 'https://via.placeholder.com/400x250/333333/ffffff?text=Image+Not+Available';
            e.target.alt = 'Image not available';
        }
    }, true);
});
