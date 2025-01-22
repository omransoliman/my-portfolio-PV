// netlify/functions/proxy.js

const https = require('https');
const url = require('url');

exports.handler = async (event, context) => {
  // Extract the image URL from the query parameters.
  const { imageUrl } = event.queryStringParameters;

  if (!imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing imageUrl parameter' }),
    };
  }
  try {
        const parsedUrl = new URL(imageUrl);
        const googleDriveUrl = `https://drive.google.com/uc?id=${parsedUrl.searchParams.get('id')}`;
        
    
        const response = await fetchImage(googleDriveUrl);
        if(response.statusCode !== 200){
            return {
                statusCode: response.statusCode,
                body: JSON.stringify({ error: 'Error fetching from google drive' }),
              };
        }

        return {
            statusCode: 200,
            headers: {
              'Content-Type': 'image/jpeg', // Adjust as needed
            },
            body: response.data.toString('base64'),
          };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching or processing' }),
          };
    }


  };

  async function fetchImage(googleDriveUrl) {
    return new Promise((resolve, reject) => {
        https.get(googleDriveUrl, { responseType: 'arraybuffer' }, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
              const fullData = Buffer.concat(chunks);
              resolve({statusCode: res.statusCode, data: fullData});
            });
            res.on('error', (err) => reject({statusCode: res.statusCode, data:err}));
          });
    });
  }