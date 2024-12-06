const axios = require("axios");
const errorHandler = require("./errorHandler");

function getNewLoginUrl() {
  const url = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=${process.env.GOOGLE_SCOPE}&response_type=code&access_type=offline`;

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        errorHandler(error, "getNewLoginUrl", "axios");
        reject(error);
      });
  });
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

  return new Promise((resolve, reject) => {
    axios
      .post(url, null, {
        params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        errorHandler(error, "getRefreshToken", "axios");
        reject(error);
      });
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

  return new Promise((resolve, reject) => {
    axios
      .post(url, null, {
        params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        errorHandler(error, "getAccessToken", "axios");
        reject(error);
      });
  });
}

module.exports = { getNewLoginUrl, getRefreshToken, getAccessToken };
