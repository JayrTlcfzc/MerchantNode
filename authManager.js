require('dotenv').config();

let authString = ''; // Global variable to store the auth string

const setAuthString = (newAuthString) => {
  console.log('Setting Auth String:', newAuthString); // Debug log
  process.env.TOKEN_AUTH_STRING = newAuthString;
};

const getAuthString = () => {
 
  const authString = process.env.TOKEN_AUTH_STRING;
  console.log('Getting Auth String:', authString); // Debug log
  return authString;
};

module.exports = { setAuthString, getAuthString };


