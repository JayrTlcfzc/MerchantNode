const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

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