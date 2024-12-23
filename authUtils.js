function getAuthString(account, sessionID, remoteAddress) {
    const authString = `${account}:${sessionID}:${remoteAddress}`;
    return Buffer.from(authString).toString('base64');  // Convert the string to base64
  }
  