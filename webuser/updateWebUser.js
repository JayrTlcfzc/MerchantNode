const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw==";

const updateWebUser = async (req, res) => {
  const { formData } = req.body;

  if (!formData) {
    return res.status(400).json({ error: 'Missing formData in request body' });
  }

  const { username, firstname, lastname, msisdn, userslevel, department, company } = formData;

  const payload = {
    USERNAME: username.toString(),
    FIRSTNAME: firstname.toString(),
    LASTNAME: lastname.toString(),
    MSISDN: msisdn.toString(),
    USERSLEVEL: userslevel.toString(),
    DEPARTMENT: department.toString(),
    COMPANY: company.toString(),
  };

  const jsonData = JSON.stringify(payload);
  console.log("Request Payload: ", jsonData);

  const storedDataString = getAuthString();

  try {
    const response = await axios.post(SERVICE_URL, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.UPDATEUSER',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(jsonData),
        'token': storedDataString,
      },
    });

    const responseData = response.data;
    console.log('Response Data:', responseData);

    if (responseData.StatusCode === 0) {
      res.status(200).json({ success: true, message: responseData.StatusMessage});
    } else {
      res.status(200).json({ success: false, message: responseData.StatusMessage });
    }
  } catch (error) {
    console.error('Error during update role:', error.message);
    res.status(500).json({ error: 'Error during update role!' });
  }
};

module.exports = updateWebUser;
