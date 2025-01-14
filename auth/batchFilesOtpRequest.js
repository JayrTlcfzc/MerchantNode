const axios = require('axios');
const { setAuthString , getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw==";

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