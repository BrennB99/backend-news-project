const express = require("express");
const app = express();
const {
  getTopics,
  invalidEndpoint,
  getArticle,
  updateArticle,
  getUsers,
} = require("./controllers/app.controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", updateArticle);

app.get("/api/users", getUsers);

app.get("*", invalidEndpoint);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID!" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
