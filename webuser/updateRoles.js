const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const updateRoles = async (req, res) => {
  const { userlevel, id, module, actionStatus } = req.body;

  console.log('Request Body:', req.body);

  if (!userlevel || !id || !module || !actionStatus) {
    console.log("userlevel: "+userlevel);
    console.log("id: "+id);
    console.log("module: "+module);
    console.log("actionStatus: "+actionStatus);
    return res.status(400).json({ error: 'Missing required parameters in the request body!' });
  }

  const payload = {
    USERSLEVEL: userlevel.toString(),
    ID: id.toString(),
    MODULE: module.toString(),
    STATUS: actionStatus.toString()
  };

  const jsonData = JSON.stringify(payload);
  console.log("jsonData: " + jsonData);
  const storedDataString = getAuthString();

  try {
    const response = await axios.post(SERVICE_URL, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'method': 'USERS.UPDATEROLES',
            'Authorization': AUTH_STRING,
            'Language': 'EN',
            'Content-Length': Buffer.byteLength(jsonData),
            'token': storedDataString,
          },
        });

    const responseData = response.data;
    console.log('TAMA BAAA', responseData);

    if (responseData.StatusCode === 0) {
      
      res.status(200).json({ success: true, message: responseData.StatusMessage, newRole: responseData.Data });
    } else {
      
      res.status(200).json({ success: false, message: responseData.StatusMessage });
    } 

  } catch (error) {
    console.error('Error during update role:', error);
    res.status(500).json({ error: 'Error during update role!' });

  }
  
}

module.exports = updateRoles;