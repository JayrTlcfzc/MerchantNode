const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const transactionTypeCollection = async () => {
  try {
    const storedDataString = getAuthString();
    const data = JSON.stringify({ "": "" });
    console.log("Requesting transaction types...");

    const response = await axios.post(SERVICE_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'REPORT.REPORTTYPE',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'token': storedDataString,
      },
    });

    console.log("Transaction types response:", response.data);
    return response.data;  
  } catch (error) {
    console.error('Error during transaction type request:', error);
    throw error;  
  }

};

const express = require('express');
const router = express.Router();

router.post('/reports/transactionTypeCollection', async (req, res) => {
  try {
    const result = await transactionTypeCollection();
    res.status(200).json(result); 
  } catch (error) {
    res.status(500).json({ error: 'Error during transaction type request' });
  }
});

module.exports = router;
