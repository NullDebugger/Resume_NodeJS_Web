const express = require("express");
const path = require("path");

const app = express();

const port = 3000;

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "./static/index.html"));
});

app.get("/test", (request, response) => {
  response.sendFile(path.join(__dirname, "./static/test.html"));
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
