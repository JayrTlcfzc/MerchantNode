const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const addUserLevel = async (req, res) => {

  const {
    userLevel, sessionTimeout, passwordExpiry, minimumPassword, passwordHistory, maxAllocation
  } = req.body;

  const payload = {
    USERSLEVEL: userLevel.toString(),
    SESSIONTIMEOUT: Number(sessionTimeout),
    PASSWORDEXPIRY: Number(passwordExpiry),
    MINPASSWORD: Number(minimumPassword),
    PASSWORDHISTORY: Number(passwordHistory),
    MAXALLOCATION: Number(maxAllocation),
  }

  const jsonData = JSON.stringify(payload);
  console.log(jsonData);
  const storedDataString = getAuthString();

  try {
    const response = await axios.post(SERVICE_URL, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.EDITUSERSLEVEL',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(jsonData),
        'token': storedDataString,
      },
    });

    const responseData = response.data;
    console.log('tama ba',responseData);
    
    if (responseData.StatusCode === 0) {
      
      res.status(200).json({ success: true, message: responseData.StatusMessage });
    } else {
      
      res.status(400).json({ success: false, message: responseData.StatusMessage });
    }

  } catch (error) {
    console.error('Error during edit user level request:', error);
    res.status(500).json({ error: 'Error during edit user level request!' });
  }

};

module.exports = addUserLevel;