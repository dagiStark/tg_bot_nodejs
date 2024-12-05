const axios = require("axios");

function getNewLoginUrl() {
  const url = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=${process.env.GOOGLE_SCOPE}&response_type=code&access_type=offline`;
  return axios.get(url);
}

function getRefreshToken(code) {
  const url = `https://oauth2.googleapis.com/token`;

  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  return axios.post(url, null, {
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

function getAccessToken(refreshToken) {
  const url = `https://oauth2.googleapis.com/token`;

  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  return axios.post(url, null, {
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", 
    },
  });
}

module.exports = { getNewLoginUrl, getRefreshToken, getAccessToken };
