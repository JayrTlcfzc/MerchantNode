const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const generateDataPDF = async (req, res) => {
  const { ID } = req.body;

  const payload = {
    ID: ID.toString(),
  }

  const jsonData = JSON.stringify(payload);
  console.log('Payload:', jsonData);

}

module.exports = generateDataPDF;