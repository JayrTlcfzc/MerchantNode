const axios = require('axios');
require('dotenv').config();
const { setAuthString, getAuthString } = require('../authManager');

class Account {
  constructor(data) {
    this.id = data.MobileAccountInfo?.ID || null;
    this.userId = data.MobileAccountInfo?.USERID || null;
    this.nickname = data.MobileAccountInfo?.ALIAS || null;
    this.msisdn = data.MobileAccountInfo?.MSISDN || null;
    this.accountType = data.MobileAccountInfo?.TYPE || null;
    this.dateRegistered = data.MobileAccountInfo?.REGDATE || null;
    this.dateModified = data.MobileAccountInfo?.MODDATE || null;
    this.kyc = data.MobileAccountInfo?.KYC || null;
    this.referenceAccount = data.MobileAccountInfo?.REFERENCEACCOUNT || null;
    this.status = data.MobileAccountInfo?.STATUS || null;
    this.locked = data.MobileAccountInfo?.LOCKED || null;
    this.currentAmount = data.CurrentstockInfo?.MAINAMOUNT || null;
    this.controlReference = data.PersonalInfo?.CONTROLREFERENCE || null;
    this.lastName = data.PersonalInfo?.LASTNAME || null;
    this.firstName = data.PersonalInfo?.FIRSTNAME || null;
    this.secondName = data.PersonalInfo?.SECONDNAME || null;
    this.idNumber = data.PersonalInfo?.IDNUMBER || null;
    this.idDescription = data.PersonalInfo?.IDDESCRIPTION || null;
    this.idExpiry = data.PersonalInfo?.IDEXPIRYDATE || null;
    this.nationality = data.PersonalInfo?.NATIONALITY || null;
    this.gender = data.PersonalInfo?.GENDER || null;
    this.dateOfBirth = data.PersonalInfo?.DATEOFBIRTH || null;
    this.placeOfBirth = data.PersonalInfo?.PLACEOFBIRTH || null;
    this.authLastName = data.PersonalInfo?.AUTHORIZINGLASTNAME || null;
    this.authFirstName = data.PersonalInfo?.AUTHORIZINGFIRSTNAME || null;
    this.authIdNumber = data.PersonalInfo?.AUTHORIZINGIDNUMBER || null;
    this.authIdDescription = data.PersonalInfo?.AUTHORIZINGIDDESCRIPTION || null;
    this.company = data.PersonalInfo?.COMPANY || null;
    this.profession = data.PersonalInfo?.PROFESSION || null;
    this.cityVillage = data.PersonalInfo?.CITY || null;
    this.streetName = data.PersonalInfo?.STREETNAME || null;
    this.bldgNumber = data.PersonalInfo?.BUILDINGNUMBER || null;
    this.region = data.PersonalInfo?.REGION || null;
    this.country = data.PersonalInfo?.COUNTRY || null;
    this.email = data.PersonalInfo?.EMAIL || null;
    this.altNumber = data.PersonalInfo?.ALTNUMBER || null;
    this.tin = data.PersonalInfo?.TINNUMBER || null;
    this.corpDate = data.CorpInfo?.CORPDATEOFINCORPORATION || null;
    this.commissionAmount = data.CurrentstockInfo?.COMMISSIONAMOUNT || null;
  }
}

const SERVICE_URL = process.env.SERVICE_URL;
const AUTH_STRING = process.env.AUTH_STRING; 

async function hasRows(req, res) {
  const { msisdn, optINP } = req.body;  
  
 
  if (!msisdn || !optINP) {
    return res.status(400).json({ success: false, message: 'Missing required fields: msisdn or optINP' });
  }

  const payload = { INP: msisdn, OPTION: optINP };
  const storedDataString = getAuthString();

  console.log(payload);
  console.log(msisdn, optINP);

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
      const account = new Account(JSON.parse(resData.Data));  
      console.log(account);
      return res.status(200).json({ StatusMessage: "Success", Account: account });
    } else {
      console.log("message", resData?.StatusMessage);
      return res.status(200).json({ success: false, message: resData?.StatusMessage || 'Error in response' });
    }
  } catch (error) {
    // Catch any errors from the external request
    console.error('Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}


module.exports = hasRows;
