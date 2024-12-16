const express = require('express');
const cors = require('cors');
const otpRequest = require('./auth/otpRequest'); // Import OTP request handler
const otpResponse = require('./auth/otpResponse');

const app = express();

// Enable CORS with default settings
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for OTP request
app.post('/auth/otpreq', otpRequest); // Use imported handler
app.post('/auth/otpres', otpResponse);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
