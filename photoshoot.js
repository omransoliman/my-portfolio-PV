// Photoshoot Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Photoshoot page loaded');
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
    // Initialize page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    // PicFlow Gallery loading indicator
    const gallery = document.querySelector('picflow-gallery');
    // Get info from localStorage
    const idScript = localStorage.getItem('photoshoot_id_script');
    const name = localStorage.getItem('photoshoot_name');
    const year = localStorage.getItem('photoshoot_year');
    if (gallery && idScript) {
        gallery.setAttribute('id', idScript);
    }
    if (name && year) {
        document.title = `${name} ${year} | Omran Soliman`;
    }
    if (gallery) {
        gallery.addEventListener('load', function() {
            console.log('PicFlow gallery loaded');
        });
        gallery.addEventListener('error', function() {
            console.error('PicFlow gallery failed to load');
        });
    }
    // Add any additional photoshoot-specific functionality here
    console.log('Photoshoot page functionality initialized');
}); 