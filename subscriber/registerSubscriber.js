const axios = require('axios');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const { setAuthString, getAuthString } = require('../authManager');

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; 

const registerSubscriber = async (req, res) => {
  const {
    nickname, mobileNumber, accountType, accountStatus, firstName, secondName, lastName,
    nationality, dateOfBirth, placeOfBirth, gender, idNumber, idDescription, idExpiry,
    company, profession, email, alternateNumber, buildingNumber, streetName, cityVillage, region, country
  } = req.body;

  const payload = {
    ALIAS: nickname.toString(),
    MSISDN: mobileNumber.toString(),
    TYPE: accountType.toString(),
    STATUS: "",
    CONTROLREFERENCE: '1',
    LASTNAME: lastName.toString(),
    FIRSTNAME: firstName.toString(),
    SECONDNAME: secondName.toString(),
    GENDER: gender.toString(),
    IDNUMBER: idNumber.toString(),
    IDDESCRIPTION: idDescription.toString(),
    IDEXPIRY: idExpiry.toString(),
    NATIONALITY: nationality.toString(),
    DATEOFBIRTH: dateOfBirth.toString(),
    PLACEOFBIRTH: placeOfBirth.toString(),
    COMPANY: company.toString(),
    PROFESSION: profession.toString(),
    EMAIL: email.toString(),
    ALTNUMBER: alternateNumber.toString(),
    BUILDINGNUMBER: buildingNumber.toString(),
    STREETNAME: streetName.toString(),
    CITY: cityVillage.toString(),
    REGION: region.toString(),
    COUNTRY: country.toString()
  };

  const jsonData = JSON.stringify(payload);
  console.log(jsonData);
  const storedDataString = getAuthString();

  try {
    const response = await axios.post(SERVICE_URL, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'method': 'ACCOUNTS.REGISTER',
        'Authorization': AUTH_STRING,
        'Language': 'EN',
        'Content-Length': Buffer.byteLength(jsonData),
        'token': storedDataString,
      },
    });

    const responseData = response.data;
    console.log('tama ba',responseData);
    
    if (responseData.StatusCode === 0) {
      
      res.status(200).json({ success: true, message: responseData.StatusMessage });
    } else {
      
      res.status(400).json({ success: false, message: responseData.StatusMessage });
    }

  } catch (error) {
    console.error('Error during registration request:', error);
    res.status(500).json({ error: 'Error during registration request!' });
  }
};

module.exports = registerSubscriber;
