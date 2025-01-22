const express = require('express');
const app = express();
const axios = require('axios');  // for making HTTP requests

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

module.exports.handler = app;