const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING;

const downloadCSV = async (req, res) => {
  const storedDataString = getAuthString();
  const { ID } = req.body;

  const payload = {
    ID: ID.toString(),
  }

  const jsonData = JSON.stringify(payload);
  console.log('Payload:', jsonData);

  try {
    const response = await axios.post(SERVICE_URL, jsonData, {
        headers: {
        'Content-Type': 'application/json',
        'method': 'REPORTS.GENERATEDOWNLOADP',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(jsonData),
        'token': storedDataString,
        },
    });
    
    const responseData = response.data;
    console.log('Response Data:', responseData);
    
    if (responseData.StatusCode === 0) {
        
        res.status(200).json({ success: true, message: responseData.StatusMessage, data: responseData.Data });
    } else {
        
        res.status(200).json({ success: false, message: responseData.StatusMessage });
    }
  } catch (error) {
      console.error('Error during csv request:', error);
      res.status(500).json({ error: 'Error during csv request!' });
  }

}

module.exports = downloadCSV;