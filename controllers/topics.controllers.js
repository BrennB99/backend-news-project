const { retrieveTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  retrieveTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
