const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

class Account {
  constructor(data) {
    this.userId = data.userid || null;
    this.username = data.username || null;
    this.msisdn = data.msisdn || null;
    this.firstname = data.firstname || null;
    this.lastname = data.lastname || null;
    this.userslevel = data.userslevel || null;
    this.status = data.status || null;
  }
}

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw==";

async function viewWebUsers(req, res) {
  const { USER, SEARCHOPTION } = req.body;

  if (!USER || !SEARCHOPTION) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const payload = { USER: USER, SEARCHOPTION: SEARCHOPTION };
  const storedDataString = getAuthString();

  try {
    const response = await axios.post(SERVICE_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.GETUSERSLIST',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
        'token': storedDataString,
      },
    });

    const resData = response.data;
    console.log(resData);

    if (resData?.StatusCode === 0) {
      const accounts = JSON.parse(resData.Data).map(user => new Account(user)); // Handle array of users
      return res.status(200).json({ StatusMessage: "Success", Accounts: accounts });
    } else {
      console.log("message", resData?.StatusMessage);
      return res.status(200).json({ success: false, message: resData?.StatusMessage || 'Error in response' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = viewWebUsers;
