const { getAxiosInstance } = require("./axios");
const {
  getRefreshTokenFromDb,
  batchWriteItems,
  getRandomPhoto,
  clearMediaItems,
} = require("./dbHandler");
const { getNewLoginUrl, getAccessToken } = require("./googleAuth");
const { getLimitedMedia } = require("./googlePhotos");
const { errorHandler } = require("./helper");

const myToken = process.env.MY_TOKEN;
const baseURL = `https://api.telegram.org/bot${myToken}/`;
const axiosInstance = getAxiosInstance(baseURL);

async function sendMessage(chatId, messageTxt) {
  try {
    return await axiosInstance.get("sendMessage", {
      chat_id: chatId || process.env.MY_GROUP_CHAT_ID,
      text: messageTxt,
    });
  } catch (er) {
    errorHandler(er, "sendMessage", "axios");
  }
}

function sendPhoto(messageObj, photoUrl, caption = "") {
  return axiosInstance.post("sendPhoto", {
    chat_id: messageObj.chat.id,
    photo: photoUrl,
    caption,
  });
}

async function handleMessage(messageObj) {
  const messageTxt = messageObj.text || "";

  if (!messageTxt) {
    errorHandler("No Message Text!", "handleMessage");
    return "";
  }

  try {
    const chatId = messageObj.chat.id;
    if (messageTxt.charAt(0) === "/") {
      const command = messageTxt.substring(1);

      switch (command) {
        case "start":
          return sendMessage(
            chatId,
            "Hi!, I'm a bot. I can help you sort out your bills"
          );

        case "getlogin":
          const data = await getNewLoginUrl();
          const parsedUrl = data.config.url.replace(/\s/g, "");
          await sendMessage(chatId, parsedUrl);
          return;

        case "updatemedia":
          await clearMediaItems();
          const refreshToken = await getRefreshTokenFromDb();
          const accessTokenData = await getAccessToken(
            refreshToken.rows[0].value
          );
          const allMediaItems = await getLimitedMedia(
            accessTokenData.data.access_token
          );
          await batchWriteItems(allMediaItems);
          return sendMessage(chatId, "All media updated successfully!");

        case "surprise":
          const randomPhoto = await getRandomPhoto();
          await sendPhoto(messageObj, randomPhoto);
          return;
        default:
          return sendMessage(chatId, "Unsupported Command!");
      }
    } else {
      return sendMessage(chatId, messageTxt);
    }
  } catch (error) {
    errorHandler(error, "handleMessage");
  }
}

module.exports = { sendMessage, handleMessage };
