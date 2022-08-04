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
} = require("./controllers/articles.controllers.js");

const {
  deleteComment,
  getArticleComments,
  postComment,
} = require("./controllers/comments.controllers");

const { getUsers } = require("./controllers/users.controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", updateArticle);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.delete("/api/comments/:comment_id", deleteComment);

app.get("*", invalidEndpoint);

app.use((err, req, res, next) => {
  //console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID!" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
