const axios = require('axios');
const { setAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw==";


function getAuthString(account, sessionID, remoteAddress) {
  const authString = `${account}@${sessionID}@${remoteAddress}`;
  return Buffer.from(authString).toString('base64');  // Convert the string to base64
}



const otpRequest = async (req, res) => {
  const { msisdn, username, password } = req.body;

  const payload = {
    MSISDN: msisdn.toString(),
    USERNAME: username.toString(),
    PASSWORD: password.toString(),
  };
  
  const account = username.toString(); 
  const sessionID = req.sessionID; 
  const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  // const remoteAddress = "::1"

  

  try {
    console.log("LOGINOTPREQ REQ:", JSON.stringify(payload));
    const authString = getAuthString(account, sessionID, remoteAddress);
    console.log("Auth String:", authString);
    setAuthString(authString);
    const response = await axios.post(SERVICE_URL, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'method': 'LOGINOTPREQ',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)), // Optional
        'token': authString,
        
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
