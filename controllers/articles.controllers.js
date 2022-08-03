const {
  retrieveArticleById,
  changeArticle,
  retrieveArticles,
  retrieveArticleComments,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  retrieveArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params;
  retrieveArticleById(id.article_id)
    .then((article) => {
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

exports.getArticleComments = (req, res, next) => {
  retrieveArticleComments(req.params)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
