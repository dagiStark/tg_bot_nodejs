const axios = require("axios");

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
        const mediaUrls = mediaItems.map((mediaItem) => mediaItem.baseUrl);
        resolve(mediaUrls);
      })
      .catch((error) => {
        console.error("Error fetching media items:", error);
        reject(error);
      });
  });
}

module.exports = { getLimitedMedia };
