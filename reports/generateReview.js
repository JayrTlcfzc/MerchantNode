const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING;

const generateReview = async () => {
  try {
    const storedDataString = getAuthString();
    const data = JSON.stringify({ "": "" });
    console.log("Requesting generate review...");

    const response = await axios.post(SERVICE_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'REPORTS.GENERATEREVIEW',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'token': storedDataString,
      },
    });

    console.log("Generate Review response:", response.data);
    return response.data;  
  } catch (error) {
    console.error('Error during generate review request:', error);
    throw error;  
  }

};

const express = require('express');
const router = express.Router();

router.post('/reports/generateReview', async (req, res) => {
  try {
    const result = await generateReview();
    res.status(200).json(result); 
  } catch (error) {
    res.status(500).json({ error: 'Error during generate review request' });
  }
});

module.exports = router;
