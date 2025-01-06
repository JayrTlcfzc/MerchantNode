const axios = require('axios');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const registerWebUser = async (req, res) => {
    const { 
        username, firstName, lastName, userLevel, msisdn, otpMsisdn, email, status, department, company
    } = req.body;

    const payload = {
        USERNAME: username.toString(),
        FIRSTNAME: firstName.toString(),
        LASTNAME: lastName.toString(),
        USERSLEVEL: userLevel.toString(),
        MSISDN: msisdn.toString(),
        MSISDNOTP: otpMsisdn.toString(),
        EMAIL: email.toString(),
        STATUS: status.toString(),
        DEPARTMENT: department.toString(),
        COMPANY: company.toString()
    };

    const jsonData = JSON.stringify(payload);
    console.log('Payload:', jsonData);
    const storedDataString = getAuthString();

    try {
        const response = await axios.post(SERVICE_URL, jsonData, {
            headers: {
            'Content-Type': 'application/json',
            'method': 'USERS.REGISTER',
            'Authorization': AUTH_STRING,
            'Language': 'EN',
            'Content-Length': Buffer.byteLength(jsonData),
            'token': storedDataString,
            },
        });
        
        const responseData = response.data;
        console.log('Response Data:', responseData);
        
        if (responseData.StatusCode === 0) {
            
            res.status(200).json({ success: true, message: responseData.StatusMessage });
        } else {
            
            res.status(200).json({ success: false, message: responseData.StatusMessage });
        }
    } catch (error) {
        console.error('Error during registration request:', error);
        res.status(500).json({ error: 'Error during registration request!' });
    }
};

module.exports = registerWebUser;