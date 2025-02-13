const axios = require('axios');
require('dotenv').config();
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING;

  
const changePassword = async (req, res) => {
  const { OLDPASSWORD, PASSWORD } = req.body;
  const encodedOldPassword = OLDPASSWORD.trim();
  const encodedPassword = decodeURIComponent(PASSWORD.trim());

  const payload = {
    OLDPASSWORD: encodedOldPassword,
    PASSWORD: encodedPassword,
  };


  try {
    console.log("CHANGE PASSWORD REQ:", JSON.stringify(payload));
    const storedDataString = getAuthString();
    console.log(storedDataString)

    const response = await axios.post(SERVICE_URL, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.CHANGEPASSWORD',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)), 
        'token': storedDataString,
      },
    });

    console.log("CHANGEPASSWORD RES:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error during OTP request:', error);
    res.status(500).json({ error: 'Error during OTP request' });
  }
};

module.exports = changePassword;
