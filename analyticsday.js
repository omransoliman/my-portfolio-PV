document.addEventListener('DOMContentLoaded', function() {
  const pageName = window.currentPage;  
  const websiteName = window.currentWebsite;  

  if (!pageName || !websiteName) {
    console.warn('Missing pageName or websiteName in global variables');
    return;
  }
  
  trackPageView(pageName, websiteName);
});

async function trackPageView(pageName, websiteName) {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbztNCJOQ_4pIc1yy1jLEzgGcYtR5ySXAHuPinDliTTuJcwebMltTmTPdBG3gfMmbqTqOw/exec'; // Replace with your deployed Web App URL
  
  try {
    const response = await fetch(`${scriptUrl}?page=${encodeURIComponent(pageName)}&website=${encodeURIComponent(websiteName)}`);
    if (!response.ok) throw new Error('Tracking failed');
    const data = await response.json();
    console.log('Page view tracked:', data);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}
