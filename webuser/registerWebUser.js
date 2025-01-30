const axios = require('axios');
require('dotenv').config(); 
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING; 

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