const {
  retrieveTopics,
  invalidEndpoint,
  retrieveArticle,
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
  retrieveArticle(id.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
