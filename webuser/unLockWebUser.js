const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw==";

async function unlockWebUser(req, res) {
  const { username } = req.body;

 console.log()

  if (!username) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const payload = { USERNAME: username};
  const storedDataString = getAuthString();

  try {
    const response = await axios.post(SERVICE_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.UNLOCKUSER',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
        'token': storedDataString,
      },
    });

    const resData = response.data;
    console.log('Lock', resData);

    if (resData?.StatusCode === 0) {
      return res.status(200).json({ success: true, message: resData?.StatusMessage });
    } else {
      console.log("message", resData?.StatusMessage);
      return res.status(200).json({ success: false, message: resData?.StatusMessage || 'Error in response' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = unlockWebUser;
