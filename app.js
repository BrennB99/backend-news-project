const express = require("express");
const app = express();
const {
  getTopics,
  invalidEndpoint,
  getArticle,
} = require("./controllers/app.controllers.js");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("*", invalidEndpoint);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID!" });
  }
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
