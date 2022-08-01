const express = require("express");
const app = express();
const {
  getTopics,
  invalidEndpoint,
} = require("./controllers/app.controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("*", invalidEndpoint);

module.exports = app;
