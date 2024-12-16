const axios = require('axios');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw==";

const otpResponse = async (req, res) => {
  const { otp ,msisdn} = req.body;

  const payload = {
    OTP: otp.toString(),
    MSISDN: msisdn.toString(),
  };

  try {
    console.log("LOGINOTPRES REQ:", JSON.stringify(payload));

    const response = await axios.post(SERVICE_URL, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'method': 'LOGINOTPRES',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)), // Optional
        'token': 'VEVTVF9KUEBwOWk2cWJydHFzanZpYmZpY3QwZjg0NnN0ZEA6OjE=',
      },
    });

    console.log("LOGINOTPRES RES:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error during OTP request:', error);
    res.status(500).json({ error: 'Error during OTP request' });
  }
};

module.exports = otpResponse;
