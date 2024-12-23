const axios = require('axios');

class Account {
  constructor() {
    this.id = null;
    this.userId = null;
    this.nickname = null;
    this.msisdn = null;
    this.accountType = null;
    this.dateRegistered = null;
    this.dateModified = null;
    this.kyc = null;
    this.referenceAccount = null;
    this.status = null;
    this.locked = null;
    this.currentAmount = null;
    this.controlReference = null;
    this.lastName = null;
    this.firstName = null;
    this.secondName = null;
    this.idNumber = null;
    this.idDescription = null;
    this.idExpiry = null;
    this.nationality = null;
    this.gender = null;
    this.dateOfBirth = null;
    this.placeOfBirth = null;
    this.authLastName = null;
    this.authFirstName = null;
    this.authIdNumber = null;
    this.authIdDescription = null;
    this.company = null;
    this.profession = null;
    this.cityVillage = null;
    this.streetName = null;
    this.bldgNumber = null;
    this.region = null;
    this.country = null;
    this.email = null;
    this.altNumber = null;
    this.tin = null;
    this.corpDate = null;
    this.commissionAmount = null;
  }
}

const SERVICE_URL = 'http://127.0.0.1:8080/Test_600_MerchantGuiService_Core/MerchantGuiReceiver/processRequest';
const AUTH_STRING = "Basic dGxjZnpjOnQzbGswbTEyMw=="; // Static auth string, can also be replaced if needed

// Function to generate token
function getAuthString(account, sessionID, remoteAddress) {
  const authString = `${account}@${sessionID}@${remoteAddress}`;
  return Buffer.from(authString).toString('base64');  // Convert the string to base64
}

async function hasRows(input, option) {
  const payload = {
    INP: '2250143767610',
    OPTION: '2',
  };

  const account = username.toString(); // Assuming req.account contains the account info
  const sessionID = req.sessionID; // or use the session id stored elsewhere
  // const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  const remoteAddress = "::1"

  const authString = getAuthString(account, sessionID, remoteAddress); // Use the getAuthString function


  try {
    console.log('Sending request to ACCOUNTS.SEARCH with payload:', payload);

     const response = await axios.post(SERVICE_URL, JSON.stringify(payload), {
          headers: {
            'Content-Type': 'application/json',
            'method': 'LOGINOTPRES',
            'Authorization': AUTH_STRING,  // Static or dynamic authorization string
            'Language': 'EN',
            'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
            'token': authString,  // Use the session token
            // 'token': 'VEVTVF9KUEBwOWk2cWJydHFzanZpYmZpY3QwZjg0NnN0ZEA6OjE=',
          },
        });
    

    const res = response.data;
    console.log('Response:', res);

    if (res && res.StatusCode === 0) {
      const data = JSON.parse(res.Data); // Parse the response data
      const account = new Account();

      // Populate Account object
      account.id = data.MobileAccountInfo.ID;
      account.userId = data.MobileAccountInfo.USERID;
      account.nickname = data.MobileAccountInfo.ALIAS;
      account.msisdn = data.MobileAccountInfo.MSISDN;
      account.accountType = data.MobileAccountInfo.TYPE;
      account.dateRegistered = data.MobileAccountInfo.REGDATE;
      account.dateModified = data.MobileAccountInfo.MODDATE;
      account.kyc = data.MobileAccountInfo.KYC;
      account.referenceAccount = data.MobileAccountInfo.REFERENCEACCOUNT;
      account.status = data.MobileAccountInfo.STATUS;
      account.locked = data.MobileAccountInfo.LOCKED;
      account.currentAmount = data.CurrentstockInfo.MAINAMOUNT;
      account.controlReference = data.PersonalInfo.CONTROLREFERENCE;
      account.lastName = data.PersonalInfo.LASTNAME;
      account.firstName = data.PersonalInfo.FIRSTNAME;
      account.secondName = data.PersonalInfo.SECONDNAME;
      account.idNumber = data.PersonalInfo.IDNUMBER;
      account.idDescription = data.PersonalInfo.IDDESCRIPTION;
      account.idExpiry = data.PersonalInfo.IDEXPIRYDATE;
      account.nationality = data.PersonalInfo.NATIONALITY;
      account.gender = data.PersonalInfo.GENDER;
      account.dateOfBirth = data.PersonalInfo.DATEOFBIRTH;
      account.placeOfBirth = data.PersonalInfo.PLACEOFBIRTH;
      account.authLastName = data.PersonalInfo.AUTHORIZINGLASTNAME;
      account.authFirstName = data.PersonalInfo.AUTHORIZINGFIRSTNAME;
      account.authIdNumber = data.PersonalInfo.AUTHORIZINGIDNUMBER;
      account.authIdDescription = data.PersonalInfo.AUTHORIZINGIDDESCRIPTION;
      account.company = data.PersonalInfo.COMPANY;
      account.profession = data.PersonalInfo.PROFESSION;
      account.cityVillage = data.PersonalInfo.CITY;
      account.streetName = data.PersonalInfo.STREETNAME;
      account.bldgNumber = data.PersonalInfo.BUILDINGNUMBER;
      account.region = data.PersonalInfo.REGION;
      account.country = data.PersonalInfo.COUNTRY;
      account.email = data.PersonalInfo.EMAIL;
      account.altNumber = data.PersonalInfo.ALTNUMBER;
      account.tin = data.PersonalInfo.TINNUMBER;
      account.corpDate = data.CorpInfo.CORPDATEOFINCORPORATION;
      account.commissionAmount = data.CurrentstockInfo.COMMISSIONAMOUNT;

      console.log('Account object:', account);
      return { success: true, account };
    } else {
      console.error('Error response:', res.StatusMessage);
      return { success: false, message: res.StatusMessage };
    }
  } catch (error) {
    console.error('Error during API request:', error.message);
    return { success: false, message: 'API request failed' };
  }
}

// Export the function for use in other files
module.exports = hasRows;
