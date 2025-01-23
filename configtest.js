// config.js
const aboutData = {
    title: "About Me",
    description: "I'm Omran Soliman, a passionate photographer and videographer dedicated to capturing life's most beautiful moments. With years of experience, I specialize in weddings, engagements, and portraits. Let's create something unforgettable together!",
    contactButton: "Get in Touch",
    image: "https://picflow.media/images/resized/1280x853q85/ffa24446-4e64-40e0-be63-0b6ac62efad6.jpg"
  };
  
  // Inject content into the page
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("about-title").textContent = aboutData.title;
    document.getElementById("about-description").textContent = aboutData.description;
    document.getElementById("contact-btn-text").textContent = aboutData.contactButton;
    document.getElementById("about-image").src = aboutData.image;
  });