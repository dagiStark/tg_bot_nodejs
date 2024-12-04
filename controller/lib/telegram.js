const { getAxiosInstance } = require("./axios");
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
