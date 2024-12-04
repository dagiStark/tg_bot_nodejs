const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { handler } = require("./controller");
const app = express();
const port = 4040;

app.use(express.json());


app.get("*", async (req, res) => {
  res.send(await handler(req, "GET"));
});

app.post("*", async (req, res) => {
  res.send(await handler(req, "POST"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
