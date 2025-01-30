const axios = require('axios');
require('dotenv').config();
const { setAuthString , getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING;

const batchFilesOtpRequest = async (req, res) => {
  const { TRANSREFERENCE, MODULE } = req.body;

  const payload = {
    "TRANSREFERENCE": TRANSREFERENCE.toString(),
  	"MODULE": MODULE.toString(),
  };

   try {
      console.log("BATCH FILES REQ:", JSON.stringify(payload));
      const storedDataString = getAuthString();
      const response = await axios.post(SERVICE_URL, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'method': 'GENERATEOTP',
          'Authorization': AUTH_STRING,
          'Language': 'EN',
          'Content-Length': Buffer.byteLength(JSON.stringify(payload)), // Optional
          'token': storedDataString,
        },
      });
  
  
      console.log("BATCH FILES OTP RES:", response.data);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error during OTP request:', error);
      res.status(500).json({ error: 'Error during OTP request' });
    }

}

module.exports = batchFilesOtpRequest;