const axios = require('axios');
const { setAuthString, getAuthString } = require('../authManager');
const { json } = require('express');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw==";

class BatchDetailsData {
  constructor(data) {
    this.fileId = data.FILEID || null;
    this.referenceId = data.REFERENCEID || null;
    this.loadedTimeStamp = data.DATETIME || data.TIMESTAMP || null;
    this.frMsisdn = data.FRMSISDN || null;
    this.toMsisdn = data.TOMSISDN || null;
    this.amount = data.AMOUNT || null;
    this.reference = data.REFERENCE || null;
    this.referenceTo = data.REFERENCETO || null;
    this.walletId = data.WALLETID || null;
    this.remarks = data.REMARKS || null;
  }
}

const batchDetails = async (req, res) => {
  const storedDataString = getAuthString();
  
  const { fileId } = req.body;
  console.log("File ID: " + fileId);

  const payload = {
    fileId: Number(fileId)
  }

  const jsonData = JSON.stringify(payload);
  console.log("jsonData" + jsonData);

  try {
      const response = await axios.post(SERVICE_URL, jsonData, {
            headers: {
              'Content-Type': 'application/json',
              'method': 'FUNDS.BATCHTEMPCOLLECTION',
              'Authorization': AUTH_STRING,
              'Language': 'EN',
              'Content-Length': Buffer.byteLength(jsonData),
              'token': storedDataString,
            },
          });
  
      const responseData = response.data;
      console.log('responseData ',responseData);
      console.log('responseData!!! ',responseData.Data);
  
      if (responseData.StatusCode === 0) {
        let resultData;
        try {
          const parsedData = JSON.parse(responseData.Data);

          // Handle array or object
          if (Array.isArray(parsedData)) {
            resultData = parsedData.map(item => new BatchDetailsData(item));
          } else {
            resultData = new BatchDetailsData(parsedData);
          }

          console.log('check', resultData);
          res.status(200).json({ 
            StatusMessage: "Success", 
            message: responseData.StatusMessage, 
            batchData: resultData 
          });
          // res.status(200).json({ success: true, message: responseData.StatusMessage, batchData: responseData.data });
        // } else {
          
        //   res.status(200).json({ success: false, message: responseData.StatusMessage });
        // } 
  
    } catch (error) {
      console.error('Error during get data:', error);
      res.status(500).json({ error: 'Error during get data!' });
  
    } } else {
      res.status(200).json({ success: false, message: responseData.StatusMessage });
    }
  } catch (error) {
    console.error('Error during get data:', error);
    res.status(500).json({ error: 'Error during get data!' });
  }

}

module.exports = batchDetails;