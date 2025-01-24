const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const generateDataPDF = async (req, res) => {
  const storedDataString = getAuthString();
  const { ID } = req.body;

  const payload = {
    ID: ID.toString(),
  }

  const jsonData = JSON.stringify(payload);
  console.log('Payload:', jsonData);

  try {
    const response = await axios.post(SERVICE_URL, jsonData, {
        headers: {
        'Content-Type': 'application/json',
        'method': 'REPORTS.GENERATEDATAPDF',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(jsonData),
        'token': storedDataString,
        },
    });
    
    const responseData = response.data;
    console.log('Response Data:', responseData);
    
    if (responseData.StatusCode === 0) {
        
        res.status(200).json({ success: true, message: responseData.StatusMessage, data: responseData.Data });
    } else {
        
        res.status(200).json({ success: false, message: responseData.StatusMessage });
    }
  } catch (error) {
      console.error('Error during pdf data request:', error);
      res.status(500).json({ error: 'Error during pdf data request!' });
  }

}

module.exports = generateDataPDF;