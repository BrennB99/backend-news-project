const { retrieveTopics, invalidEndpoint } = require("../models/app.models");

exports.getTopics = (req, res, next) => {
  retrieveTopics().then((topics) => {
    console.log(topics);
    res.status(200).send({ topics });
  });
};

exports.invalidEndpoint = (req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
};
