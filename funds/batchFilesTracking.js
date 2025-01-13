const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const batchFilesTracking = async () => {
  try {
    const storedDataString = getAuthString();
    const data = JSON.stringify({ "": "" });
    console.log("Requesting batch files tracking...");

    const response = await axios.post(SERVICE_URL, data, {
          headers: {
            'Content-Type': 'application/json',
            'method': 'FUNDS.BATCHTRACKINGCOL',
            'Authorization': AUTH_STRING,
            'Language': 'EN',
            'token': storedDataString,
          },
        });
    
        console.log("response.data: ", response.data);
        return response.data;  

  } catch (error) {
    console.error('Error during batch files request:', error);
    throw error;  
  }
};

const express = require('express');
const router = express.Router();

router.post('/funds/batchFilesTracking', async (req, res) => {
  try {
    const result = await batchFilesTracking();
    res.status(200).json(result); 
  } catch (error) {
    res.status(500).json({ error: 'Error during batch  files request' });
  }
});

module.exports = router;