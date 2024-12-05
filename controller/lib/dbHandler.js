const { Pool } = require("pg");

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

