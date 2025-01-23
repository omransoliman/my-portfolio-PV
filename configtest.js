const aboutData = {
  title: "About Me",
  description: "I'm Omran Soliman, a passionate photographer and videographer dedicated to capturing life's most beautiful moments. With years of experience, I specialize in weddings, engagements, and portraits. Let's create something unforgettable together!",
  contactButton: "Get in Touch",
  image: "https://picflow.media/images/resized/1280x853q85/ffa24446-4e64-40e0-be63-0b6ac62efad6.jpg"
};

// Inject content into the page
document.addEventListener("DOMContentLoaded", () => {
  const aboutTitle = document.getElementById("about-title");
  const aboutDescription = document.getElementById("about-description");
  const contactButton = document.getElementById("contact-btn-text");
  const aboutImage = document.getElementById("about-image");

  if (aboutTitle && aboutDescription && contactButton && aboutImage) {
    aboutTitle.textContent = aboutData.title;
    aboutDescription.textContent = aboutData.description;
    contactButton.textContent = aboutData.contactButton;
    aboutImage.src = aboutData.image;
  } else {
    console.error("One or more elements not found in the DOM.");
  }
});