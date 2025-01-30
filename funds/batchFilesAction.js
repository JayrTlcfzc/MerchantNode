const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING; 

async function batchFilesAction(req, res) {

  const storedDataString = getAuthString();
  const { fileId, otp, remarks, module } = req.body
  console.log("fileId: "+ fileId);
  console.log("otpValue: "+ otp);
  console.log("remarks: "+ remarks);

  const payload = {
    fileId: fileId.toString(),
    OTP: otp.toString(),
    REMARKS: remarks.toString()
  }
  console.log("PAYLOAD: ", payload);

  // const method = { module: module.toString() }
  console.log("MODULE: " + module);

try {
    
    const response = await axios.post(SERVICE_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'method': module,
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
        'token': storedDataString,  
      },
    });

    const resData = response.data; 
    console.log("resData: " , resData.StatusCode);

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

module.exports = batchFilesAction;