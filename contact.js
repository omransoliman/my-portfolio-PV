// Contact form submission logic (separated from script.js)
// Mirrors the add-review approach: URL-encoded POST to Apps Script Web App

(function() {
  // Helpers for language
  function getLang() {
    try {
      const v = localStorage.getItem('ospv_language');
      return (v === 'EN' || v === 'FR') ? v : 'FR';
    } catch(_) { return 'FR'; }
  }

  const I18N = {
    EN: {
      contactTitle: 'CONTACT ME',
      labels: {
        firstName: 'FIRST NAME:',
        lastName: 'LAST NAME:',
        email: 'EMAIL:',
        country: 'COUNTRY:',
        phone: 'PHONE NUMBER:',
        subject: 'SUBJECT:',
        message: 'MESSAGE:'
      },
      selectCountry: 'Select Country',
      send: 'SEND MESSAGE',
      sending: 'Sending...',
      alerts: {
        success: 'Message sent successfully!',
        failed: 'Failed to send message. Please try again.'
      },
      errors: {
        firstName: 'First name must be at least 2 characters',
        lastName: 'Last name must be at least 2 characters',
        email: 'Please enter a valid email address',
        country: 'Please select your country',
        phone: 'Please enter a valid phone number',
        subject: 'Subject must be at least 5 characters',
        message: 'Message must be at least 10 characters'
      }
    },
    FR: {
      contactTitle: 'CONTACTEZ-MOI',
      labels: {
        firstName: 'PRÉNOM :',
        lastName: 'NOM :',
        email: 'EMAIL :',
        country: 'PAYS :',
        phone: 'NUMÉRO DE TÉLÉPHONE :',
        subject: 'OBJET :',
        message: 'MESSAGE :'
      },
      selectCountry: 'Sélectionnez le pays',
      send: 'ENVOYER',
      sending: 'Envoi…',
      alerts: {
        success: 'Message envoyé avec succès !',
        failed: 'Échec de l\'envoi du message. Veuillez réessayer.'
      },
      errors: {
        firstName: 'Le prénom doit contenir au moins 2 caractères',
        lastName: 'Le nom doit contenir au moins 2 caractères',
        email: 'Veuillez saisir une adresse e-mail valide',
        country: 'Veuillez sélectionner votre pays',
        phone: 'Veuillez saisir un numéro de téléphone valide',
        subject: 'L\'objet doit contenir au moins 5 caractères',
        message: 'Le message doit contenir au moins 10 caractères'
      }
    }
  };

  function applyContactTexts() {
    const lang = getLang();
    const t = I18N[lang];
    // Title
    const titleEl = document.querySelector('.contact-title');
    if (titleEl) titleEl.textContent = t.contactTitle;
    // Labels
    const setLabel = (forId, text) => {
      const el = document.querySelector(`label[for="${forId}"]`);
      if (el) el.textContent = text;
    };
    setLabel('firstName', t.labels.firstName);
    setLabel('lastName', t.labels.lastName);
    setLabel('email', t.labels.email);
    setLabel('phoneCountry', t.labels.country);
    setLabel('phone', t.labels.phone);
    setLabel('subject', t.labels.subject);
    setLabel('message', t.labels.message);
    // Select placeholder option
    const countrySelect = document.getElementById('phoneCountry');
    if (countrySelect && countrySelect.options && countrySelect.options.length) {
      const firstOpt = countrySelect.options[0];
      if (firstOpt && !firstOpt.value) firstOpt.textContent = t.selectCountry;
    }
    // Submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) submitBtn.textContent = t.send;
  }

  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // TODO: Replace with your deployed Contact Apps Script Web App URL
    const CONTACT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzlLgofTDaQt2pj4N8vbUKtnQUA7BcRKeRMFKkP6O5oQ08Y9k1Wy6gGgA5eI3kV5Mk/exec';

    const firstNameEl = document.getElementById('firstName');
    const lastNameEl = document.getElementById('lastName');
    const emailEl = document.getElementById('email');
    const phoneCountryEl = document.getElementById('phoneCountry');
    const phoneEl = document.getElementById('phone');
    const subjectEl = document.getElementById('subject');
    const messageEl = document.getElementById('message');

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      try {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = I18N[getLang()].sending;
        }

        const payload = {
          firstName: (firstNameEl.value || '').trim(),
          lastName: (lastNameEl.value || '').trim(),
          email: (emailEl.value || '').trim(),
          countryNumber: (phoneCountryEl.value || '').trim(),
          phoneNumber: (phoneEl.value || '').trim(),
          subject: (subjectEl.value || '').trim(),
          message: (messageEl.value || '').trim()
        };

        // Basic client-side validation (mirrors server)
        const errors = validateForm(payload);
        if (errors.length) {
          alert(errors.join('\n'));
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText || I18N[getLang()].send;
          }
          return;
        }

        // URL-encoded body to avoid CORS preflight
        const body = new URLSearchParams(payload);

        const resp = await fetch(CONTACT_WEB_APP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
          body: body.toString()
        });

        if (!resp.ok) throw new Error('Network response was not ok');

        let data;
        try {
          data = await resp.json();
        } catch (err) {
          const text = await resp.text();
          console.error('Non-JSON response from contact Apps Script:', text.slice(0, 500));
          throw new Error('Server did not return JSON. Check Apps Script deployment and access.');
        }

        if (data && data.success) {
          alert(I18N[getLang()].alerts.success);
          form.reset();
        } else {
          throw new Error((data && data.message) || I18N[getLang()].alerts.failed);
        }
      } catch (err) {
        console.error('Contact submit error:', err);
        alert(I18N[getLang()].alerts.failed);
      } finally {
        const submitBtn = form.querySelector('.submit-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = I18N[getLang()].send;
        }
      }
    });

    function validateForm(data) {
      const errors = [];
      const t = I18N[getLang()].errors;
      if (!data.firstName || data.firstName.length < 2) errors.push(t.firstName);
      if (!data.lastName || data.lastName.length < 2) errors.push(t.lastName);
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push(t.email);
      if (!data.countryNumber) errors.push(t.country);
      if (!data.phoneNumber || !/^[0-9+\-\s()]+$/.test(data.phoneNumber)) errors.push(t.phone);
      if (!data.subject || data.subject.length < 5) errors.push(t.subject);
      if (!data.message || data.message.length < 10) errors.push(t.message);
      return errors;
    }

    // Initial apply and react to language changes
    applyContactTexts();
    window.addEventListener('ospv:languageChanged', applyContactTexts);
  });
})();
