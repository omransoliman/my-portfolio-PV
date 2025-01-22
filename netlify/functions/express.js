const express = require('express');
const axios = require('axios');  // for making HTTP requests

const app = express();

app.get('/proxy', async (req, res) => {
  const { imageUrl } = req.query;

  try {
    const response = await axios.get(decodeURIComponent(imageUrl), { responseType: 'arraybuffer' });
    res.set('Content-Type', 'image/jpeg');  // or the appropriate image MIME type
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