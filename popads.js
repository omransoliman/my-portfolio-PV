/* PopAds front-end loader
 - Fetches pop ads from Google Apps Script doGet() JSON endpoint
 - Filters by action=true and by page (matches window.currentPage or 'all')
 - Honors 'times': 'all the time' or 'one time' via localStorage
 - Bilingual: uses localStorage('ospv_language') to pick title/description
*/
(function(){
  // Configure your deployed Google Apps Script Web App URL here
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxMvHARUXJUkjWcJc8LkPF3flSP10ZjFeRJVDGZDU04WNDQeCzQwCzjlnewNyO2N9u-/exec';
  if (!SCRIPT_URL || SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    console.warn('[PopAds] Please set SCRIPT_URL in popads.js to your Apps Script Web App URL.');
    return;
  }

  function lang(){ try { const v = localStorage.getItem('ospv_language'); return (v==='EN'||v==='FR')?v:'FR'; } catch(_) { return 'FR'; } }
  function getPageName(){
    if (window.currentPage && typeof window.currentPage === 'string') return window.currentPage;
    const path = (location.pathname || '').split('/').pop() || '';
    const name = path.replace(/\.[^.]+$/, '');
    return name || 'Home';
  }
  function shouldShowTimes(item){
    const id = String(item.id ?? '').trim();
    const times = String(item.times ?? '').toLowerCase();
    if (times.includes('one')) {
      const key = `popad_dismissed_${id}`;
      return !localStorage.getItem(key);
    }
    return true; // 'all the time' or anything else
  }
  function markDismissed(item){
    const id = String(item.id ?? '').trim();
    const times = String(item.times ?? '').toLowerCase();
    if (times.includes('one')) {
      const key = `popad_dismissed_${id}`;
      try { localStorage.setItem(key, '1'); } catch(_) {}
    }
  }
  function renderPop(item){
    const L = lang();
    const title = (L==='EN') ? (item.titleEN||'') : (item.titleFR||'');
    const desc  = (L==='EN') ? (item.descriptionEN||'') : (item.descriptionFR||'');
    const link  = item.link || '';

    let overlay = document.querySelector('.popads-overlay');
    if (!overlay){
      overlay = document.createElement('div');
      overlay.className = 'popads-overlay';
      overlay.innerHTML = `
        <div class="popads-card" role="dialog" aria-modal="true" aria-live="polite">
          <div class="popads-head">
            <h3 class="popads-title"></h3>
            <button class="popads-close" aria-label="Close">✕</button>
          </div>
          <div class="popads-body"></div>
          <div class="popads-actions">
            ${link ? '<button class="popads-btn primary" data-action="open"></button>' : ''}
            <button class="popads-btn" data-action="close"></button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
    }

    const tOpen = (L==='EN') ? 'Open' : 'Ouvrir';
    const tClose = (L==='EN') ? 'Close' : 'Fermer';
    overlay.querySelector('.popads-title').textContent = title || (L==='EN'?'Notice':'Annonce');
    overlay.querySelector('.popads-body').textContent = desc || '';
    const openBtn = overlay.querySelector('[data-action="open"]');
    if (openBtn) openBtn.textContent = tOpen;
    overlay.querySelector('[data-action="close"]').textContent = tClose;

    function close(){ overlay.style.display = 'none'; markDismissed(item); }
    overlay.querySelector('.popads-close').onclick = close;
    overlay.querySelector('[data-action="close"]').onclick = close;
    if (openBtn) openBtn.onclick = function(){ if (link) { window.open(link, '_blank'); } close(); };

    overlay.style.display = 'flex';
  }

  async function load(){
    try {
      const res = await fetch(SCRIPT_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Bad response');
      const rows = await res.json();
      const page = getPageName().toLowerCase();
      const active = (rows||[]).filter(r => String(r.action||'').toLowerCase() === 'true')
        .filter(r => {
          const where = String(r.page||'').toLowerCase();
          return where === 'all' || where === page;
        })
        .filter(shouldShowTimes);
      if (active.length > 0) {
        // Show the first active one for now (could rotate later)
        renderPop(active[0]);
      }
    } catch (e) {
      console.warn('[PopAds] failed to load', e);
    }
  }

  document.addEventListener('DOMContentLoaded', load);
  window.addEventListener('ospv:languageChanged', () => {
    // Refresh by reloading, so text updates to current language if visible next time
  });
})();
