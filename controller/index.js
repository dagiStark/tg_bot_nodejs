const { sendMessage, handleMessage } = require("./lib/telegram");
const { errorHandler } = require("./lib/helper");
const {
  getNewLoginUrl,
  getRefreshToken,
  getAccessToken,
} = require("./lib/googleAuth");
const { getLimitedMedia } = require("./lib/googlePhotos");
const {
  updateRefreshTokenInDb,
  getRefreshTokenFromDb,
  batchWriteItems,
  getRandomPhoto,
} = require("./lib/dbHandler");

const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

async function handler(req, method) {
  try {
    if (method === "GET") {
      // TO TEST
      if (req.url === "/get-random") {
        const url = await getRandomPhoto();
        return url;
      }

      // TO TEST
      if (req.url === "/batch") {
        const testingData = ["url1", "url2", "url3"];
        await batchWriteItems(testingData);
        return "Success";
      }

      if (req.url === "/pg-get-token") {
        const refreshTokenFromDb = await getRefreshTokenFromDb();
        return refreshTokenFromDb.rows[0].value;
      }

      if (req.url === "/pg-update") {
        const tokenToUpdate = "SomeNewValue";
        await updateRefreshTokenInDb(tokenToUpdate);
        return "Success";
      }

      if (req.url === "/test") {
        const data = await getNewLoginUrl();
        return data.config.url;
      }

      if (req.url === "/test-2") {
        const result = await getLimitedMedia(accessToken);
        await batchWriteItems(result);
        return JSON.stringify(result);
      }

      if (req.url === "/get-access-token") {
        const result = await getAccessToken(refreshToken);
        return result.data.access_token;
      }

      if (req.url.indexOf("/gtoken") !== -1) {
        const data = req.query.code;
        const result = await getRefreshToken(data);
        const refreshToken = result.data.refresh_token;
        await updateRefreshTokenInDb(refreshToken);
        return "Successfully updated refresh token";
      }
      return "unknown request";
    }

    const { body } = req;

    if (body && body.message) {
      const messageObj = body.message;
      await handleMessage(messageObj);
      return "Success";
    }

    return "Unknown request";
  } catch (error) {
    errorHandler(error, "mainIndexHandler");
  }
}

module.exports = { handler };
