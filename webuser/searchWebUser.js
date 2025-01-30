const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

class Account {
    constructor(data) {
      this.userId = data.userId || null;      
      this.username = data.userName || null;  
      this.msisdn = data.msisdn || null;      
      this.firstname = data.firstName || null;
      this.lastname = data.lastName || null;  
      this.userslevel = data.usersLevel || null;
      this.status = data.status || null;      
      this.dateRegistered = data.dateRegistered || null; 
      this.dateModified = data.dateModified || null; 
      this.otp = data.msisdnotp || null;     
      this.locked = data.locked || null;      
      this.department = data.department || null; 
      this.email = data.email || null;     
      this.company = data.company || null; 
    }
  }
  

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING;

async function searchWebUser(req, res) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const payload = { USER: username};
  const storedDataString = getAuthString();

  try {
    const response = await axios.post(SERVICE_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.SEARCHUSER',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
        'token': storedDataString,
      },
    });

    const resData = response.data;
    console.log(resData);

    if (resData?.StatusCode === 0) {
        const account = new Account(JSON.parse(resData.Data)); // Handle array of users
      return res.status(200).json({ StatusMessage: "Success", Accounts: account });
    } else {
      console.log("message", resData?.StatusMessage);
      return res.status(200).json({ success: false, message: resData?.StatusMessage || 'Error in response' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = searchWebUser;
