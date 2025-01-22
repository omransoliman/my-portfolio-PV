const { URL } = require('url');
const https = require('https');

exports.handler = async function (event, context) {
  // check if it is a proxy request
  if (!event.queryStringParameters.imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing imageUrl parameter' }),
    };
  }
  const imageUrl = event.queryStringParameters.imageUrl;

  try {
    // Fetch the image data from the URL
    const parsedUrl = new URL(imageUrl);
    const response = await new Promise((resolve, reject) => {
      const request = https.get(parsedUrl);
      request.on('response', (res) => {
        const data = [];
        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => {
          const imageData = Buffer.concat(data);
          resolve({
            statusCode: 200,
            body: imageData.toString('base64'),
            headers: {
              'Content-Type': 'image/jpeg', // Set the correct content type here
              'Content-Length': imageData.length,
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'true',
              'Access-Control-Allow-Access': 'true',
              'Access-Control-Allow-Methods':'GET, POST, OPTIONS, DELETE'
            },
          });
        });
      });
      request.on('error', (error) => {
        console.error('Error in get image data', error);
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Error fetching image data' }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'true',
            'Access-Control-Allow-Access': 'true',
          },
        });
      });
    });
    return response;
  } catch (error) {
    console.error('Error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};