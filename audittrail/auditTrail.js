const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

class AuditTrials {
    constructor(data) {
        this.logs = [];
        try {
            // If data is already an object, no need to parse it
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            this.logs = parsedData.map(log => ({
                id: log.ID || null,
                userId: log.USERID || null,
                username: log.USERNAME || null,
                log: log.LOG || null,
                ip: log.IP || null,
                timestamp: log.TIMESTAMP || null,
                interface: log.INTERFACE || null
            }));
        } catch (error) {
            console.error("Error parsing audit data:", error);
        }
    }
}

async function getAuditTrail(req, res) {
  const { USERID, DATEFROM, DATETO } = req.body;  

  if (!USERID || !DATEFROM || !DATETO) {
    return res.status(400).json({ success: false, message: 'Missing required fields: USERID, DATEFROM or DATETO' });
  }

  const payload = {
    USERID: USERID.toString(),
    DATEFROM: DATEFROM.toString(),
    DATETO: DATETO.toString(),
  };
  
  const storedDataString = getAuthString();

  console.log(payload);

  try {
    const response = await axios.post(SERVICE_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'USERS.GETAUDITTRAILS',
        'Authorization': AUTH_STRING,  
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
        'token': storedDataString,  
      },
    });

    const resData = response.data; 
    console.log(resData);

    if (resData?.StatusCode === 0) {
      // Directly pass resData.Data if it's already an object
      const audit = new AuditTrials(resData.Data); 
      console.log("audits", audit);
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
