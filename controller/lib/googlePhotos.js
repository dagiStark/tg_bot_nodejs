const axios = require("axios");
const { errorHandler } = require("./helper");

function getLimitedMedia(accessToken) {
  return new Promise((resolve, reject) => {
    const params = {
      pageSize: 10, // Limit to 10 pictures
    };

    const axiosConfig = {
      method: "get",
      url: "https://photoslibrary.googleapis.com/v1/mediaItems",
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    axios(axiosConfig)
      .then((response) => {
        const mediaItems = response.data.mediaItems || [];
        // Extract only the base URLs of the media items
        const mediaIds = mediaItems.map((mediaItem) => mediaItem.id);
        resolve(mediaIds);
      })
      .catch((error) => {
        errorHandler(error, "getLimitedMedia", "axios");
        reject(error);
      });
  });
}

function getMediaItem(itemId, accessToken) {
  return new Promise((resolve, reject) => {
    const axiosConfig = {
      method: "get",
      url: `https://photoslibrary.googleapis.com/v1/mediaItems/${itemId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    axios(axiosConfig)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        errorHandler(error, "getMediaItem", "axios");
        reject(error);
      });
  });
}

module.exports = { getLimitedMedia, getMediaItem };
