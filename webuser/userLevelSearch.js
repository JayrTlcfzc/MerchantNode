const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

class UserLevelData {
  constructor(data) {
    // this.userLevel = data.userLevel || null;
    this.sessionTimeout = data.SESSIONTIMEOUT || null;
    this.passwordExpiry = data.PASSWORDEXPIRY || null;
    this.minimumPassword = data.MINPASSWORD || null;
    this.passwordHistory = data.PASSWORDHISTORY || null;
    this.maxAllocation = data.MAXALLOCUSER || null;
    this.userslevel = data.USERSLEVEL;
  }
}

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING;

const userLevelSearch = async (req, res) => {
  const storedDataString = getAuthString();

  const { userLevel } = req.body;
  console.log("User Level: " + userLevel);

  const payload = {
    USERSLEVEL: userLevel.toString()
  };

  const jsonData = JSON.stringify(payload);

  try {
    const response = await axios.post(SERVICE_URL, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.USERSLEVELSEARCH',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(jsonData),
        'token': storedDataString,
      },
    });

    const responseData = response.data;
    console.log('tama ba', responseData.Data);

    if (responseData.StatusCode === 0) {
      let resultData;
      try {
        const parsedData = JSON.parse(responseData.Data);

        // Handle array or object
        if (Array.isArray(parsedData)) {
          resultData = parsedData.map(item => new UserLevelData(item));
        } else {
          resultData = new UserLevelData(parsedData);
        }

        console.log('check', resultData);
        res.status(200).json({ 
          StatusMessage: "Success", 
          message: responseData.StatusMessage, 
          userLevelData: resultData 
        });
      } catch (parseError) {
        console.error('Error parsing responseData.Data:', parseError);
        res.status(500).json({ error: 'Error parsing response data!' });
      }
    } else {
      res.status(200).json({ success: false, message: responseData.StatusMessage });
    }
  } catch (error) {
    console.error('Error during get roles:', error);
    res.status(500).json({ error: 'Error during get roles!' });
  }
};

module.exports = userLevelSearch;