const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING; 

const batchPaymentUpload = async (req, res) => {

  const storedDataString = getAuthString();

  const { FILENAME, FILEPATH, MSISDN } = req.body;
  console.log(req.body);

  const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

  const payload = {
    msisdn: MSISDN.toString(),
    fileName: FILENAME.toString(),
    csvFileName : FILEPATH.toString(),
    ip: remoteAddress.toString(),
  }

  console.log("payload  ",payload)

  try {
      
      const response = await axios.post(SERVICE_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'method': 'FUNDS.BATCHALLOCREQUEST',
          'Authorization': AUTH_STRING,
          'Language': 'EN',
          'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
          'token': storedDataString,  
        },
      });
  
      const resData = response.data; 
  
      if (resData?.StatusCode === 0) {
        return res.status(200).json({ success: true, message: resData.StatusMessage });
      } else {
        return res.status(200).json({ success: false, message: resData?.StatusMessage || 'Error in response' });
      }
    } catch (error) {
      // Catch any errors from the external request
      console.error('Error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

}

module.exports = batchPaymentUpload;