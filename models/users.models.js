const db = require("../db/connection");

exports.retrieveUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};
