/* Notifications front-end module
 - Fetches notifications from Google Apps Script doGet() JSON endpoint
 - Shows a bell at top-left with a red badge count of active notifications
 - Panel lists all active notifications (action=true) with bilingual text and optional link button
 - Uses localStorage('ospv_language') to choose EN/FR fields
 - Network-only fetch with cache: 'no-store'
*/
(function(){
  // Configure your deployed Google Apps Script Web App URL here (backend doGet)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPR54LL-_FbZ33HITuyMH9otID-DadahaUKPObT0TEhyUi9pt5UaLuiODrLuuT8ag/exec';
  if (!SCRIPT_URL || SCRIPT_URL === 'YOUR_NOTIFICATIONS_APPS_SCRIPT_URL_HERE') {
    console.warn('[Notifications] Please set SCRIPT_URL in notifications.js to your Apps Script Web App URL.');
    return;
  }

  function lang(){ try { const v = localStorage.getItem('ospv_language'); return (v==='EN'||v==='FR')?v:'FR'; } catch(_) { return 'FR'; } }

  function ensureUI(){
    // Bell
    let bell = document.querySelector('.notify-bell');
    if (!bell) {
      bell = document.createElement('button');
      bell.className = 'notify-bell';
      bell.setAttribute('aria-label','Notifications');
      bell.innerHTML = '<span class="icon"><i class="fa-regular fa-bell fa-lg" style="color: #ff4d67;"></i></span><span class="badge" style="display:none;">0</span>';
      document.body.appendChild(bell);
    }
    // Overlay + panel
    let overlay = document.querySelector('.notify-panel-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'notify-panel-overlay';
      overlay.innerHTML = `
        <div class="notify-panel" role="dialog" aria-modal="true" aria-live="polite">
          <div class="notify-head">
            <h3 class="notify-title">Notifications</h3>
            <button class="notify-close" aria-label="Close">✕</button>
          </div>
          <div class="notify-list" id="notify-list"></div>
        </div>`;
      document.body.appendChild(overlay);
    }
    return { bell, overlay };
  }

  function renderList(items){
    const L = lang();
    const list = document.getElementById('notify-list');
    if (!list) return;
    list.innerHTML = items.map(item => {
      const title = (L==='EN') ? (item.titleEN||'') : (item.titleFR||'');
      const desc  = (L==='EN') ? (item.descriptionEN||'') : (item.descriptionFR||'');
      const link  = item.link || '';
      const btn   = link ? `<div class="notify-actions"><button class="notify-btn" data-link="${encodeURI(link)}">${L==='EN'?'Open':'Ouvrir'}</button></div>` : '';
      return `<div class="notify-item">
        <h4>${title || (L==='EN'?'Notification':'Notification')}</h4>
        <p>${desc || ''}</p>
        ${btn}
      </div>`;
    }).join('');
    // Wire link buttons
    list.querySelectorAll('[data-link]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-link');
        if (url) window.open(url, '_blank');
      });
    });
  }

  function updateBadge(count){
    const bell = document.querySelector('.notify-bell');
    if (!bell) return;
    const badge = bell.querySelector('.badge');
    if (count > 0) {
      badge.textContent = String(count);
      badge.style.display = 'inline-block';
      bell.classList.add('pulse');
    } else {
      badge.style.display = 'none';
      bell.classList.remove('pulse');
    }
  }

  function openPanel(){
    const overlay = document.querySelector('.notify-panel-overlay');
    if (overlay) overlay.style.display = 'flex';
  }
  function closePanel(){
    const overlay = document.querySelector('.notify-panel-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  async function load(){
    ensureUI();
    try {
      const res = await fetch(SCRIPT_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Bad response');
      const rows = await res.json();
      const active = (rows||[]).filter(r => String(r.action||'').toLowerCase() === 'true');
      renderList(active);
      updateBadge(active.length);
    } catch (e) {
      console.warn('[Notifications] failed to load', e);
      renderList([]);
      updateBadge(0);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const { bell, overlay } = ensureUI();
    bell.addEventListener('click', () => {
      const isOpen = document.querySelector('.notify-panel-overlay')?.style.display === 'flex';
      isOpen ? closePanel() : openPanel();
    });
    overlay?.querySelector('.notify-close')?.addEventListener('click', closePanel);
    load();
  });

  window.addEventListener('ospv:languageChanged', () => {
    // Rerender localized text without re-fetching data
    // In case you want full refresh, call load() here
    // For now, re-open panel will show localized strings next time
    load();
  });
})();
