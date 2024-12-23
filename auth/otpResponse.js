const axios = require('axios');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const { getAuthString } = require('../authManager');


const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; // Static auth string, can also be replaced if needed


// OTP Response handler
const otpResponse = async (req, res) => {
  const { otp, msisdn, username, password } = req.body;

  const payload = {
    OTP: otp.toString(),
    MSISDN: msisdn.toString(),
    USERNAME: username.toString(),
    PASSWORD: password.toString(),
  };

  const storedDataString = getAuthString();
  console.log(storedDataString);
  try {
    console.log("LOGINOTPRES REQ:", JSON.stringify(payload));

    const response = await axios.post(SERVICE_URL, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'method': 'LOGINOTPRES',
        'Authorization': AUTH_STRING,  
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
       'token': storedDataString,
      },
    });

    localStorage.setItem('LOGINOTPRES', JSON.stringify(response.data));


    console.log("LOGINOTPRES RES:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error during OTP request:', error);
    res.status(500).json({ error: 'Error during OTP request' });
  }
};

module.exports = otpResponse;
