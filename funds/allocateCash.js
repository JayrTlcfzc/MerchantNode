const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING; 

async function allocateCash(req, res) {
  const { amount, auth, commandId, destmsisdn, extendedData, otp, pin, remarks, requestId,sender } = req.body;  
  
  const payload = {
    OTP: otp.toString(),
    PIN: pin.toString(),
    requestId: requestId.toString(),
    commandId: commandId.toString(),
    sender: sender.toString(),
    destination: destmsisdn.toString(),
    auth: auth.toString(),
    amount: amount.toString(),
    remarks: remarks.toString(),
    'extended-data' : extendedData.toString(),
  };
  const storedDataString = getAuthString();
  try {
    
    const response = await axios.post(SERVICE_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'FUNDS.CASHALLOCATION',
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


module.exports = allocateCash;
