const { Pool } = require("pg");
const { errorHandler } = require("./helper");

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Connected to the database");
  }
  release(); // Release the client back to the pool
});

function updateRefreshTokenInDb(token) {
  return new Promise((resolve, reject) => {
    try {
      const query = {
        text: `UPDATE key_value_pairs SET value = $1, created_on = $2 WHERE key = $3`,
        values: [token, new Date(), "tele_bot_google_refresh_token"],
      };
      pool.query(query, (err, res) => {
        if (err) {
          errorHandler(err, "updateRefreshTokenInDb", "pg");
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getRefreshTokenFromDb() {
  return new Promise((resolve, reject) => {
    try {
      const query = {
        text: `SELECT value FROM key_value_pairs WHERE key = $1`,
        values: ["tele_bot_google_refresh_token"],
      };
      pool.query(query, (err, res) => {
        if (err) {
          errorHandler(err, "getRefreshTokenFromDb", "pg");
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function batchWriteItems(imageIds) {
  return new Promise((resolve, reject) => {
    try {
      if (
        !Array.isArray(imageIds) ||
        imageIds.some((ids) => typeof ids !== "string")
      ) {
        throw new Error("imageUrls must be an array of strings");
      }
      const query = {
        text: `INSERT INTO media_items (media_id) SELECT * FROM UNNEST ($1::text[])`,
        values: [imageIds],
      };
      pool.query(query, (err, res) => {
        if (err) {
          throw new Error(err);
        } else {
          resolve(res);
        }
      });
    } catch (error) {
      errorHandler(error, "batchWriteItems", "pg");
      reject(error);
    }
  });
}

function getRandomPhotoId() {
  return new Promise((resolve, reject) => {
    try {
      const query = {
        text: `SELECT media_id FROM media_items ORDER BY random() LIMIT 1`,
      };
      pool.query(query, (err, res) => {
        if (err) {
          throw new Error(err);
        } else {
          resolve(res.rows[0].media_id);
        }
      });
    } catch (error) {
      errorHandler(error, "getRandomPhoto", "pg");
      reject(error);
    }
  });
}

function clearMediaItems() {
  return new Promise((resolve, reject) => {
    try {
      const query = {
        text: `DELETE FROM media_items`,
      };
      pool.query(query, (err, res) => {
        if (err) {
          errorHandler(err, "clearMediaItems", "pg");
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  updateRefreshTokenInDb,
  getRefreshTokenFromDb,
  batchWriteItems,
  getRandomPhotoId,
  clearMediaItems,
};
