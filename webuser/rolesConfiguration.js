const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING; 

const rolesConfiguration = async (req, res) => {
  const storedDataString = getAuthString();
  
  const { userLevel } = req.body;
  console.log("User Level: " + userLevel);

  const payload = {
    USERSLEVEL: userLevel.toString()
  }

  const jsonData = JSON.stringify(payload);

  try {
    const response = await axios.post(SERVICE_URL, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'method': 'USERS.GETROLES',
            'Authorization': AUTH_STRING,
            'Language': 'EN',
            'Content-Length': Buffer.byteLength(jsonData),
            'token': storedDataString,
          },
        });

    const responseData = response.data;
    console.log('tama ba',responseData.Data);

    if (responseData.StatusCode === 0) {
      
      res.status(200).json({ success: true, message: responseData.StatusMessage, roles: responseData.Data });
    } else {
      
      res.status(200).json({ success: false, message: responseData.StatusMessage });
    } 

  } catch (error) {
    console.error('Error during get roles:', error);
    res.status(500).json({ error: 'Error during get roles!' });

  }
  
}

module.exports = rolesConfiguration;