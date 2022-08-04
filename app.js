const express = require("express");
const app = express();
const {
  getTopics,
  invalidEndpoint,
} = require("./controllers/topics.controllers.js");

const {
  getArticleById,
  updateArticle,
  getArticles,
  getArticleComments,
  postComment,
} = require("./controllers/articles.controllers.js");

const { getUsers } = require("./controllers/users.controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.patch("/api/articles/:article_id", updateArticle);
app.post("/api/articles/:article_id/comments", postComment);

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
