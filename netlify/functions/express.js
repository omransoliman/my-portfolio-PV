const express = require('express');
const axios = require('axios');  // for making HTTP requests

const app = express();

app.get('/proxy', async (req, res) => {
  const { imageUrl } = req.query;

  try {
    const response = await axios.get(decodeURIComponent(imageUrl), { 
      responseType: 'arraybuffer', 
      maxRedirects: 5, // Allow Axios to follow up to 5 redirects (if needed)
    });
    res.set('Content-Type', response.headers['content-type']); // Set the correct content type from the response
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching image');
  }
});

// Export the handler for Netlify functions
module.exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    app.handle(event, context, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};