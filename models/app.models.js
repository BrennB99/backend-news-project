const db = require("../db/connection");

exports.retrieveTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.retrieveArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
};

exports.changeArticle = (articleInfo) => {
  const { article_id, inc_votes } = articleInfo;
  const infoArray = [article_id, inc_votes];

  if (inc_votes === undefined || isNaN(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Invalid Input!" });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *`,
      infoArray
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.retrieveUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};
