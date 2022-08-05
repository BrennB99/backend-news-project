const { retrieveApi } = require("../models/app.models");

exports.getApi = (req, res, next) => {
  retrieveApi().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};

exports.invalidEndpoint = (req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
};
