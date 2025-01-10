const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const batchUploadedFiles = async () => {
  try {
    const storedDataString = getAuthString();
    const data = JSON.stringify({ "": "" });
    console.log("Requesting batch uploaded files...");

    const response = await axios.post(SERVICE_URL, data, {
          headers: {
            'Content-Type': 'application/json',
            'method': 'FUNDS.BATCHUPLOADEDCOL',
            'Authorization': AUTH_STRING,
            'Language': 'EN',
            'token': storedDataString,
          },
        });
    
        console.log("response.data: ", response.data);
        return response.data;  

  } catch (error) {
    console.error('Error during batch uploaded files request:', error);
    throw error;  
  }
};

const express = require('express');
const router = express.Router();

router.post('/funds/batchUploadedFiles', async (req, res) => {
  try {
    const result = await batchUploadedFiles();
    res.status(200).json(result); 
  } catch (error) {
    res.status(500).json({ error: 'Error during batch uploaded files request' });
  }
});

module.exports = router;