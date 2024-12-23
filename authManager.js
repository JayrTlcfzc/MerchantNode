let authString = ''; // Global variable to store the auth string

const setAuthString = (newAuthString) => {
  console.log('Setting Auth String:', newAuthString); // Debug log
  authString = newAuthString;
};

const getAuthString = () => {
  console.log('Getting Auth String:', authString); // Debug log
  return authString;
};

module.exports = { setAuthString, getAuthString };
