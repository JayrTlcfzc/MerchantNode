const axios = require('axios');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw==";

const otpRequest = async (req, res) => {
  const { msisdn, username, password } = req.body;

  const payload = {
    MSISDN: msisdn.toString(),
    USERNAME: username.toString(),
    PASSWORD: password.toString(),
  };

  try {
    console.log("LOGINOTPREQ REQ:", JSON.stringify(payload));

    const response = await axios.post(SERVICE_URL, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'method': 'LOGINOTPREQ',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)), // Optional
        'token': 'VEVTVF9KUEBwOWk2cWJydHFzanZpYmZpY3QwZjg0NnN0ZEA6OjE=',
      },
    });

    console.log("LOGINOTPREQ RES:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error during OTP request:', error);
    res.status(500).json({ error: 'Error during OTP request' });
  }
};

module.exports = otpRequest;
