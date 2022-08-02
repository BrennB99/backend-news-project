const {
  retrieveTopics,
  invalidEndpoint,
  retrieveArticle,
  changeArticle,
  retrieveUsers,
  commentCount,
} = require("../models/app.models");

exports.getTopics = (req, res, next) => {
  retrieveTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.invalidEndpoint = (req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
};

exports.getArticle = (req, res, next) => {
  const id = req.params;
  return Promise.all([
    retrieveArticle(id.article_id),
    commentCount(id.article_id),
  ])
    .then((values) => {
      const article = values[0];
      const commentNum = values[1];
      article.comment_count = commentNum;
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const articleInfo = {
    inc_votes: req.body.inc_votes,
    article_id: req.params.article_id,
  };

  changeArticle(articleInfo)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  retrieveUsers().then((users) => {
    res.status(200).send({ users });
  });
};
