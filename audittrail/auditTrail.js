const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

class AuditTrials {
    constructor(data) {
      this.id = data.MobileAccountInfo?.ID || null;
      this.userId = data.MobileAccountInfo?.USERID || null;
      this.nickname = data.MobileAccountInfo?.ALIAS || null;
      this.msisdn = data.MobileAccountInfo?.MSISDN || null;
      this.accountType = data.MobileAccountInfo?.TYPE || null;
      this.dateRegistered = data.MobileAccountInfo?.REGDATE || null;
    }
}

async function getAuditTrail(req, res) {
  const { USERID, DATEFROM, DATETO } = req.body;  

  
  if (!USERID || !DATEFROM || !DATETO) {
    return res.status(400).json({ success: false, message: 'Missing required fields: USERID, DATEFROM or DATETO' });
  }

  
  const payload = req.body;
  
  const storedDataString = getAuthString();

  console.log(payload);
  console.log(USERID, DATEFROM, DATETO);

  try {
    
    const response = await axios.post(SERVICE_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'ACCOUNTS.SEARCH',
        'Authorization': AUTH_STRING,  
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
        'token': storedDataString,  
      },
    });

    const resData = response.data; 
    console.log(resData);

    if (resData?.StatusCode === 0) {
      const audit = new AuditTrials(JSON.parse(resData.Data));  
      return res.status(200).json({ StatusMessage: "Success", Audit: audit });
    } else {
      console.log("message", resData?.StatusMessage);
      return res.status(200).json({ success: false, message: resData?.StatusMessage || 'Error in response' });
    }
  } catch (error) {
    
    console.error('Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = getAuditTrail;
