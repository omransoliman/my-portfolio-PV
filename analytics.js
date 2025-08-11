document.addEventListener('DOMContentLoaded', function() {
    // Get the page name from the global variable
  const pageName = window.currentPage;
  
  if (!pageName) {
    console.warn('No page name set in window.currentPage');
    return;
  }
  
  trackPageView(pageName);
});

async function trackPageView(pageName) {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbwGU5RQfDo-VGieIwITaBHicLqU5bi1WmXr2aY3_o6k-p0rZXPid4EOiUkOY_3wC-Xp/exec'; // Replace with your deployed Web App URL
  
  try {
    const response = await fetch(`${scriptUrl}?page=${encodeURIComponent(pageName)}`);
    if (!response.ok) throw new Error('Tracking failed');
    const data = await response.json();
    console.log('Page view tracked:', data);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}
  
