# Website Documentation for Omran Soliman's Photography Portfolio

This documentation provides a **detailed and specific guide** to understanding the structure, functionality, and components of Omran Soliman's photography portfolio website. It is designed to help **designers** and **coders** maintain consistency across the website. The website showcases Omran's work in various photography categories, including weddings, engagements, and portraits, and includes interactive elements like a photo quiz, reviews section, and contact form.

---

## Table of Contents
1. [Website Structure](#1-website-structure)
2. [Pages and Functionality](#2-pages-and-functionality)
3. [Styling and Design](#3-styling-and-design)
4. [Interactive Features](#4-interactive-features)
5. [Third-Party Integrations](#5-third-party-integrations)
6. [Localization and Language Support](#6-localization-and-language-support)
7. [SEO and Analytics](#7-seo-and-analytics)
8. [Contact and Reviews](#8-contact-and-reviews)
9. [Photo Quiz](#9-photo-quiz)
10. [Picflow Gallery Integration](#10-picflow-gallery-integration)
11. [EmailJS Integration](#11-emailjs-integration)
12. [Google Sheets Integration](#12-google-sheets-integration)
13. [Deployment and Maintenance](#13-deployment-and-maintenance)

---

## 1. Website Structure

The website is a **multi-page application** with the following pages:

- **Home (`index.html`)**: The landing page with a slideshow, portfolio sections, and a contact form.
- **About (`about.html`)**: Information about Omran Soliman, including his background and photography style.
- **Portfolio Pages**:
  - **Wedding (`wedding.html`)**: Showcases wedding photography.
  - **Engagement (`engagement.html`)**: Displays engagement photography.
  - **Portrait (`portrait.html`)**: Features portrait photography.
- **Reviews (`reviews.html`)**: A page where users can view and submit reviews.
- **Photo Quiz (`games/PhotoQuiz.html`)**: An interactive quiz to test photography knowledge.
- **Contact Form**: Integrated into the home page for users to get in touch.

---

## 2. Pages and Functionality

### Home Page (`index.html`)
- **Slideshow**:
  - Displays a rotating set of images from the `config.js` file.
  - Images are defined in the `homeSlideshow.images` array in `config.js`.
  - The slideshow interval is set to 5 seconds by default, but it can be adjusted in `config.js`.
  - The transition effect is a fade animation.
- **Portfolio Grid**:
  - Links to the wedding, engagement, and portrait portfolio pages.
  - Each portfolio item has a background image and a title overlay.
  - The background images are defined in the `portfolio-grid` section of `index.html`.
- **Contact Form**:
  - Fields: First Name, Last Name, Email, Phone Number, Subject, and Message.
  - Submissions are handled by **EmailJS**.
  - The form is validated to ensure all required fields are filled.
- **Promo Modal**:
  - Displays an exclusive offer for photography sessions.
  - The modal appears automatically when the page loads and can be closed by clicking the "X" button or outside the modal.
  - The modal content is defined in the `promoModal` section of `index.html`.

### About Page (`about.html`)
- **About Section**:
  - Contains a brief description of Omran Soliman, his photography style, and a call-to-action button to contact him.
  - The content is dynamically loaded from `config.js` based on the selected language (English or French).
  - The text content is defined in the `translations` object in `config.js`.
- **Image Section**:
  - Displays a professional image of Omran.
  - The image source is defined in `config.js` under `translations.en.about.image` and `translations.fr.about.image`.

### Portfolio Pages (`wedding.html`, `engagement.html`, `portrait.html`)
- **Picflow Gallery**:
  - Embeds a gallery of images for each category (wedding, engagement, portrait) using the Picflow service.
  - The gallery ID for each category is defined in `config.js` under `picflowGalleryIds`.
  - Customization options include lightbox, padding, and background settings.
  - The gallery is embedded using the `<picflow-gallery>` tag with the appropriate `data-gallery-id`.

### Reviews Page (`reviews.html`)
- **Review Submission Form**:
  - Fields: Full Name, Rating (1-5 stars), Profile Image (max 5MB), and Review Comment (max 500 characters).
  - Submissions are stored in a **Google Sheet** using a Google Apps Script.
  - The form is validated to ensure all fields are filled and the image is less than 5MB.
- **Review Display**:
  - Reviews are displayed in a grid layout with star ratings and user details.
  - Each review card has a unique background color based on its position in the grid.
  - The reviews are fetched from a Google Sheet and displayed dynamically using JavaScript.

### Photo Quiz (`games/PhotoQuiz.html`)
- **Quiz Interface**:
  - The quiz consists of multiple-choice questions about photography terms and techniques.
  - Questions are defined in `quizData.js`.
  - Each question has 3 possible answers, and the correct answer is marked by the `correct` property.
  - Users select an answer, and the system checks if it is correct.
- **Score Tracking**:
  - Users' scores are tracked and displayed in real-time.
  - The score is incremented for each correct answer.
  - The score is displayed using the `updateScoreDisplay` function.
- **Leaderboard**:
  - Scores are submitted to a **Google Sheet** and displayed in a leaderboard.
  - The leaderboard shows the top scores, including the player's name, email, and score.
  - The leaderboard is updated dynamically using the `updateLeaderboardDisplay` function.

---

## 3. Styling and Design

The website uses a combination of **custom CSS** and third-party libraries for styling:

- **Custom CSS**:
  - `style.css`: Handles the overall layout, typography, and responsive design.
  - `stylegame.css`: Specific styles for the Photo Quiz page.
  - `bestreviewsHome.css`: Styles for the reviews section on the home page.
- **Font Awesome**: Used for icons throughout the website.
- **Google Fonts**: The "Audiowide" font is used for headings and titles.

### Key Styling Features:
- **Responsive Design**:
  - The website is fully responsive, with mobile-friendly navigation and layout adjustments.
  - Media queries are used to adjust the layout for different screen sizes.
  - The navigation bar collapses into a hamburger menu on mobile devices.
- **Dark/Light Mode**:
  - The website supports both dark and light modes based on user preferences.
  - The color scheme is defined using CSS variables in `style.css`.
  - The `prefers-color-scheme` media query is used to detect the user's system preference.
- **Animations**:
  - Subtle animations are used for transitions, such as the slideshow and the about section.
  - Keyframe animations like `fadeIn`, `slideIn`, and `zoomIn` are used for visual effects.

---

## 4. Interactive Features

### Photo Quiz (`games/PhotoQuiz.html`)
- **Quiz Questions**:
  - Questions are loaded from `quizData.js`.
  - Each question has 3 possible answers, and the correct answer is marked by the `correct` property.
  - The answers are shuffled using the Fisher-Yates algorithm to ensure randomness.
- **Score Tracking**:
  - The score is displayed in real-time using the `updateScoreDisplay` function.
  - The score is incremented for each correct answer.
- **Leaderboard**:
  - Scores are submitted to a **Google Sheet** using a Google Apps Script.
  - The leaderboard is updated dynamically using the `updateLeaderboardDisplay` function.

### Reviews Section (`reviews.html`)
- **Review Submission**:
  - Users can submit reviews with their name, rating, comment, and profile image.
  - The form is validated to ensure all fields are filled and the image is less than 5MB.
  - The form submission is handled by a Google Apps Script.
- **Review Display**:
  - Reviews are displayed in a grid layout with star ratings and user details.
  - Each review card has a unique background color based on its position in the grid.
  - The reviews are fetched from a Google Sheet and displayed dynamically using JavaScript.

---

## 5. Third-Party Integrations

### Google Tag Manager
- **Purpose**: Used for managing tracking scripts and analytics.
- **Implementation**: The Google Tag Manager script is included in the `<head>` section of each page.

### Picflow Gallery
- **Purpose**: Used to display photo galleries for wedding, engagement, and portrait sections.
- **Implementation**: The gallery is embedded using the `<picflow-gallery>` tag with a unique gallery ID from `config.js`.

### EmailJS
- **Purpose**: Handles the contact form submissions.
- **Implementation**: The contact form on the home page sends messages via EmailJS.

### Google Sheets
- **Purpose**: Stores quiz scores and reviews.
- **Implementation**: Quiz scores and reviews are submitted to Google Sheets using a Google Apps Script.

---

## 6. Localization and Language Support

The website supports both **English** and **French** languages. The language can be toggled using a language switch button.

- **Language Toggle**:
  - The language switch button changes the text content of the website between English and French.
  - The selected language is saved in `localStorage` for persistence.
- **Localization Logic**:
  - The `script.js` file handles the language toggle functionality.
  - Text content is dynamically updated based on the selected language using data attributes (`data-en` and `data-fr`).

---

## 7. SEO and Analytics

### SEO
- **Meta Tags**: Basic meta tags are included in the `<head>` section of each page.
- **Structured Data**: The website uses structured data for better search engine visibility.

### Analytics
- **Google Tag Manager**: Used for tracking user interactions and analytics.

---

## 8. Contact and Reviews

### Contact Form
- **Fields**: Name, email, phone number, subject, and message.
- **Submission**: The form is submitted via EmailJS, and users receive a confirmation message.

### Reviews Section
- **Review Submission**: Users can submit reviews with their name, rating, comment, and profile image.
- **Review Display**: Reviews are displayed in a grid layout with star ratings and user details.

---

## 9. Photo Quiz

### Quiz Interface
- **Questions**: The quiz consists of multiple-choice questions about photography terms and techniques.
- **Score Tracking**: Users' scores are tracked and displayed in real-time.
- **Leaderboard**: Scores are submitted to a Google Sheet and displayed in a leaderboard.

---

## 10. Picflow Gallery Integration

### Gallery Embedding
- **Implementation**: The gallery is embedded using the `<picflow-gallery>` tag with a unique gallery ID from `config.js`.
- **Customization**: The gallery can be customized with options like lightbox, padding, and background.

---

## 11. EmailJS Integration

### Contact Form Submission
- **Purpose**: Handles the contact form submissions.
- **Implementation**: The contact form on the home page sends messages via EmailJS.

---

## 12. Google Sheets Integration

### Quiz Scores and Reviews
- **Purpose**: Stores quiz scores and reviews.
- **Implementation**: Quiz scores and reviews are submitted to Google Sheets using a Google Apps Script.

---

## 13. Deployment and Maintenance

### Deployment
- **Hosting**: The website can be hosted on any static hosting service (e.g., GitHub Pages, Netlify, Vercel).
- **Domain**: A custom domain can be configured for the website.

### Maintenance
- **Content Updates**: Content can be updated by modifying the `config.js` file or the respective HTML files.
- **Bug Fixes**: Regular updates and bug fixes can be managed through version control (e.g., Git).

---

## Conclusion

This documentation provides a **detailed and specific overview** of Omran Soliman's photography portfolio website. It covers the structure, functionality, and key features of the website, making it easy for **designers** and **coders** to maintain consistency and functionality. For further assistance, refer to the code comments and configuration files.

---

**Note**: This documentation is intended for developers, designers, and content managers who will be working on or maintaining the website.