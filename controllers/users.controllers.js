const { retrieveUsers } = require("../models/users.models.js");

exports.getUsers = (req, res, next) => {
  retrieveUsers().then((users) => {
    res.status(200).send({ users });
  });
};
