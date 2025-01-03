const axios = require('axios');
// const { LocalStorage } = require('node-localstorage');
// const localStorage = new LocalStorage('./scratch');
const { setAuthString, getAuthString } = require('../authManager');


const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 


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

   
    const responseData = response.data;

   
    if (responseData.Data) {
      const parsedData = JSON.parse(responseData.Data); 
      const token = parsedData.token;
      console.log('parseddata', parsedData);
      if (token) {
        setAuthString(token); 
        console.log("Token set successfully:", token);
      } else {
        console.error("Token not found in response.");
      }
    } else {
      console.error("No 'Data' field in response.");
    }

    // localStorage.setItem('LOGINOTPRES', JSON.stringify(responseData));
    console.log("LOGINOTPRES RES:", responseData);
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error during OTP request:', error);
    res.status(500).json({ error: 'Error during OTP request!' });
  }
};

module.exports = otpResponse;
