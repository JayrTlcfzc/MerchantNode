const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

async function batchFilesAction(req, res) {

  const storedDataString = getAuthString();
  const { fileId, otpValue, remarks, module } = req.body

  const payload = {
    fileId: fileId.toString(),
    OTP: otpValue.toString(),
    REMARKS: remarks.toString()
  }
  console.log("PAYLOAD: " + payload);

  const method = { module: module.toString() }
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
    console.log("resData: " + resData);

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