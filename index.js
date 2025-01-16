const express = require('express');
const cors = require('cors');

const otpRequest = require('./auth/otpRequest'); // Import OTP request handler
const otpResponse = require('./auth/otpResponse');
const allocateOtpRequest = require('./auth/allocateOtpRequest');
const batchFilesOtpRequest = require('./auth/batchFilesOtpRequest');

const changePassword = require('./changepassword/changePassword');
const hasRows = require('./subscriber/searchSubsriber');
const accountTypes = require('./subscriber/accountTypeCollection');
const pendingSubs = require('./subscriber/viewPendingSubscriber');
const registerSubscriber = require('./subscriber/registerSubscriber');

const registerWebUser = require('./webuser/registerWebUser');
const userLevels = require('./webuser/userLevelCollection');
const rolesConfiguration = require('./webuser/rolesConfiguration');
const viewWebUsers = require('./webuser/viewWebUsers');
const updateRoles = require('./webuser/updateRoles')
const searchWebUser = require('./webuser/searchWebUser');
const addUserLevel = require('./webuser/addUserLevel');
const editUserLevel = require('./webuser/editUserLevel');
const userLevelSearch = require('./webuser/userLevelSearch');
const lockWebUser = require('./webuser/lockWebUser');
const unlockWebUser = require('./webuser/unLockWebUser');
const activeWebUser = require('./webuser/activeWebUser');
const deactiveWebUser = require('./webuser/deactiveWebUser');
const resetWebUser = require('./webuser/resetWebUser');
const updateWebUser = require('./webuser/updateWebUser');

const requestReports = require('./reports/requestReport');
const transactionType = require('./reports/transactionTypeCollection');
const generateReview = require('./reports/generateReview');

const batchUploadedFiles = require('./funds/batchUploadedFiles');
const batchFilesRequest = require('./funds/batchFilesRequest');
const batchFilesTracking = require('./funds/batchFilesTracking');
const bankCollection = require('./funds/bankCollection')
const batchDetails = require('./funds/batchDetails');
const batchFilesAction = require('./funds/batchFilesAction');
const allocateCash = require('./funds/allocateCash');
const walletToBank = require('./funds/walletToBank');
const batchPaymentUpload = require('./funds/batchPaymentUpload');
const { upload, uploadFile } = require('./funds/fileUpload');

const getAuditTrail = require('./audittrail/auditTrail');
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
app.post('/auth/allocateOtpReq', allocateOtpRequest);
app.post('/auth/batchFilesOtpRequest', batchFilesOtpRequest);

app.post('/changepassword/changePasswordReq', changePassword);

app.post('/subscriber/searchSubscriber', hasRows);
app.post('/subscriber/accountTypeCollection', accountTypes);
app.post('/subscriber/registerSubscriber', registerSubscriber);
app.post('/subscriber/viewPendingSubsCollection', pendingSubs);

app.post('/webuser/registerWebUser', registerWebUser);
app.post('/webuser/userLevel', userLevels);
app.post('/webuser/rolesConfiguration', rolesConfiguration);
app.post('/webuser/viewWebUser', viewWebUsers);
app.post('/webuser/updateRoles', updateRoles);
app.post('/webuser/searchWebUser', searchWebUser);
app.post('/webuser/addUserLevel', addUserLevel);
app.post('/webuser/editUserLevel', editUserLevel);
app.post('/webuser/userLevelSearch', userLevelSearch);
app.post('/webuser/lockWebUser', lockWebUser);
app.post('/webuser/unlockWebUser', unlockWebUser);
app.post('/webuser/activeWebUser', activeWebUser);
app.post('/webuser/deactiveWebUser', deactiveWebUser);
app.post('/webuser/resetWebUser', resetWebUser);
app.post('/webuser/updateWebUser', updateWebUser);

app.post('/reports/requestReport', requestReports);
app.post('/reports/transactionTypeCollection', transactionType);
app.post('/reports/generateReview', generateReview);

app.post('/funds/allocateCash', allocateCash);
app.post('/funds/batchUploadedFiles', batchUploadedFiles);
app.post('/funds/batchFilesRequest', batchFilesRequest);
app.post('/funds/batchFilesTracking', batchFilesTracking);
app.post('/funds/batchDetails', batchDetails);
app.post('/funds/batchFilesAction', batchFilesAction);
app.post('/funds/walletToBank', walletToBank);
app.post('/funds/bankCollection', bankCollection);
app.post('/funds/batchPaymentUpload', batchPaymentUpload);
app.post('/funds/fileUpload', upload.single('file'), uploadFile);

app.post('/audit/getAuditTrails', getAuditTrail);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
