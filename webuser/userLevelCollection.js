const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING;

const userLevelCollection = async () => {
  try {
    const storedDataString = getAuthString();
    const data = JSON.stringify({ "": "" });
    console.log("Requesting user levels...");

    const response = await axios.post(SERVICE_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.GETUSERSLEVELS',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'token': storedDataString,
      },
    });

    console.log("User levels response:", response.data);
    return response.data;  
  } catch (error) {
    console.error('Error during user levels request:', error);
    throw error;  
  }
};


const express = require('express');
const router = express.Router();

router.post('/webuser/userLevel', async (req, res) => {
  try {
    const result = await userLevelCollection();
    res.status(200).json(result); 
  } catch (error) {
    res.status(500).json({ error: 'Error during user levels request' });
  }
});

module.exports = router;
