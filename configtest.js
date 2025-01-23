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



























// config.js - Save this file separately to easily update your website content
const config = {
  homeBackground: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg', // Replace with the actual image path

  websiteName: "Omran Soliman",
  instagram: "https://www.instagram.com/soliman.omran",
  email: "omransoliman.pv@gmail.com",
  phone: "+33625965257",


  homeSlideshow: {
      images: [
          'https://picflow.media/images/resized/1280x853q85/47bc71cd-9712-45bb-962d-f138fed92bf1.jpg',
          'https://picflow.media/images/resized/1280x720q85/2ab141bb-55fc-4d1c-9116-07ab5354b876.jpg',
          'https://picflow.media/images/resized/1280x720q85/08566703-c8bc-47e8-84f6-56bd2b239a1b.jpg',
          'https://picflow.media/images/resized/1280x853q85/3ddb348b-a765-4979-a817-cb93babbc523.jpg',
          'https://picflow.media/images/resized/1280x853q85/ffa24446-4e64-40e0-be63-0b6ac62efad6.jpg'
      ],
      interval: 5000, // Default 5 seconds, can be changed
      transitionEffect: 'fade' // Optional transition effect
  },

  // Translations
  translations: {
      fr: {
          homeTitle: "capture la vie. la beauté. l'amour.",
          homeSubtitle: "Photos et vidéos des meilleurs moments de la vie",
          aboutText: "Que ce soit pour un paysage, un portrait ou un moment spontané, mon objectif est toujours de créer des œuvres significatives et percutantes. Je vous invite à visiter mon site web pour voir mon portfolio et me suivre sur les réseaux sociaux pour suivre mes derniers travaux et aventures. Je serais ravi d'échanger avec vous et de discuter de vos projets photo ou vidéo à venir.",
          menu: {
              home: "Accueil",
              portfolio: "Portfolio",
              contact: "Contact",
              about: "À propos",
              engagement: "Fiançailles",
              wedding: "Mariages",
              portrait: "Portraits",
          },
          engagement: {
              pageTitle: "Portfolio - Fiançailles",
              pageSubtitle: "Découvrez nos magnifiques photographies de fiançailles mettant en valeur l'amour et la connexion.",
          },
          wedding: {
              pageTitle: "Portfolio - Mariages",
              pageSubtitle: "Explorez notre collection de photos de mariage, capturant des moments d'amour et de joie.",
          },
          portrait: {
              pageTitle: "Portfolio - Portraits",
              pageSubtitle: "Découvrez des portraits artistiques mettant en lumière les émotions et la personnalité de chaque individu.",
          },
      },
      en: {
          homeTitle: "capture life. beauty. love.",
          homeSubtitle: "Photos and videos of life's best moments",
          aboutText: "Whether I am taking a landscape, portrait or spontaneous moment, my goal is always to create meaningful and impactful works. I invite you to visit my website to see my portfolio and follow me on social media to keep up with my latest work and adventures. I would love to hear from you and discuss any upcoming photo or video projects you have in mind.",
          menu: {
              home: "Home",
              portfolio: "Portfolio",
              contact: "Contact",
              about: "About",
              engagement: "Engagement",
              wedding: "Weddings",
              portrait: "Portraits",
          },
          engagement: {
              pageTitle: "Portfolio - Engagements",
              pageSubtitle: "Discover our stunning engagement photography showcasing love and connection.",
          },
          wedding: {
              pageTitle: "Portfolio - Weddings",
              pageSubtitle: "Explore our collection of wedding photos capturing moments of love and joy.",
          },
          portrait: {
              pageTitle: "Portfolio - Portraits",
              pageSubtitle: "View artistic portraits highlighting the emotions and personalities of individuals.",
          },
      },
  },

  // Picflow gallery IDs for different portfolio sections
  picflowGalleryIds: {
      engagement: "gal_OH9DLiMDm9lOzTY0", // Replace with the actual Picflow Gallery ID
      wedding: "gal_j9zj3XwvUre5THEd", // Replace with the actual Picflow Gallery ID
      portrait: "gal_cBCgnwN8J3xVUCf7", // Replace with the actual Picflow Gallery ID
  },
};