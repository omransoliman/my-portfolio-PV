# Photography Portfolio Website Documentation

## Table of Contents
1. [Website Overview](#website-overview)
2. [File Structure](#file-structure)
3. [Features](#features)
4. [Making Common Changes](#making-common-changes)
5. [Technical Details](#technical-details)
6. [Troubleshooting](#troubleshooting)

## Website Overview
This is a one-page photography portfolio website built for Omran Soliman Photography. It features a responsive design, bilingual support (French/English), and dark/light mode capabilities.

Current website information:
- Website Name: Omran Soliman
- Instagram: @soliman.omran
- Email: omransoliman.pv@gmail.com
- Phone: +33625965257

## File Structure
```
root/
├── index.html         # Main website file
├── config.js          # Configuration file for easy updates
└── README.md          # This documentation
```

## Features

### 1. Responsive Design
- Works on desktop, tablet, and mobile devices
- Automatically adjusts layout based on screen size
- Responsive navigation menu that collapses on mobile

### 2. Navigation
- Logo on the left side
- Menu items on the right side
- Order: Home → Portfolio → Contact → About
- Instagram link in the menu
- Language toggle (FR/EN)

### 3. Bilingual Support
- Default language: French
- Toggle between French and English
- All text content is available in both languages

### 4. Theme Support
- Automatically switches between light/dark mode based on device settings
- Light mode: White background, dark text
- Dark mode: Dark background, light text

### 5. Sections
- Home: Background image with tagline
- Portfolio: Three sections (Wedding, Engagement, Portrait)
- Contact: Form with email and phone
- About: Biography and information

## Making Common Changes

### Basic Information Updates
Open `config.js` and modify these fields:
```javascript
websiteName: "Omran Soliman",
instagram: "https://instagram.com/soliman.omran",
email: "omransoliman.pv@gmail.com",
phone: "+33625965257"
```

### Updating Portfolio Images
1. Upload your images to Google Drive
2. Get the sharing link
3. Update the portfolio links in `config.js`:
```javascript
portfolioLinks: {
    wedding: "YOUR_GOOGLE_DRIVE_LINK",
    engagement: "YOUR_GOOGLE_DRIVE_LINK",
    portrait: "YOUR_GOOGLE_DRIVE_LINK"
}
```

### Changing Text Content
To update translations, modify the translations object in `config.js`:
```javascript
translations: {
    fr: {
        homeTitle: "Your French Title",
        homeSubtitle: "Your French Subtitle",
        aboutText: "Your French About Text"
    },
    en: {
        homeTitle: "Your English Title",
        homeSubtitle: "Your English Subtitle",
        aboutText: "Your English About Text"
    }
}
```

### Updating Home Background
In `index.html`, find the `#home` section's background URL:
```css
#home {
    background: url('your-image-url-here') center/cover;
}
```

### Changing Colors
To modify the color scheme, update these CSS variables in `index.html`:
```css
:root {
    --primary-color: #333;
    --background-color: #fff;
    --text-color: #333;
}

@media (prefers-color-scheme: dark) {
    :root {
        --primary-color: #fff;
        --background-color: #1a1a1a;
        --text-color: #fff;
    }
}
```

## Technical Details

### Languages Used
- HTML5
- CSS3
- JavaScript (ES6+)

### Fonts
- Main font: Audiowide (Google Fonts)
- Loading: `<link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet">`

### Key JavaScript Functions
1. `toggleLanguage()`: Switches between French and English
2. `loadPhotos()`: Loads portfolio images from Google Drive
3. Configuration object: Stores all updateable content

### Contact Form
Uses Formspree for form submission:
```html
<form action="https://formspree.io/your-email@domain.com" method="POST">
```

## Troubleshooting

### Common Issues

1. Images not loading:
   - Check Google Drive sharing permissions
   - Verify portfolio links in config.js
   - Ensure proper image format (JPG/PNG recommended)

2. Language toggle not working:
   - Check data-fr and data-en attributes in HTML
   - Verify translations in config.js
   - Check console for JavaScript errors

3. Contact form issues:
   - Verify email in Formspree configuration
   - Check required fields are filled
   - Confirm form action URL is correct

### Getting Help
If you need additional assistance:
1. Check the HTML comments for guidance
2. Review the configuration file
3. Contact the original developer
4. Consult GitHub Pages documentation

## Version History
- Initial Release: January 2025
- Last Updated: [Current Date]
- Created by: [Your Name]

Remember to update this documentation whenever significant changes are made to the website.