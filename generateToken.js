const crypto = require('crypto');

function generateToken(account, sessionID, remoteAddress) {
  const hash = crypto.createHash('sha256');
  hash.update(account + sessionID + remoteAddress);
  return hash.digest('hex'); // or use any other method of generating token
}
