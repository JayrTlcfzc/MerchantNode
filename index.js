const express = require('express');
const cors = require('cors');
const otpRequest = require('./auth/otpRequest'); // Import OTP request handler
const otpResponse = require('./auth/otpResponse');
const changePassword = require('./changepassword/changePassword');
const hasRows = require('./subscriber/searchSubsriber');
const session = require('express-session');

const app = express();

// Enable CORS with default settings
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'KbPeShVmYq3t6v9y$B&E)H@McQfTjWnZ',  // Use a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   // Set to true if using HTTPS
}));


app.get('/get-token', (req, res) => {
  const token = req.session.token; // Assuming the token was previously stored in the session
  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(400).json({ error: 'Token not found' });
  }
});

app.use(express.json());

// Route for OTP request
app.post('/auth/otpreq', otpRequest); // Use imported handler
app.post('/auth/otpres', otpResponse);
app.post('/changepassword/changePasswordReq', changePassword);
app.post('/subscriber/searchSubscriber', hasRows);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
