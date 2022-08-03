const db = require("../db/connection");
const { checkExists } = require("../utils/utils");

exports.retrieveArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [article_id]
    )
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

exports.retrieveArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.retrieveArticleComments = (id) => {
  const { article_id } = id;
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(async ({ rows }) => {
      if (!rows.length) {
        await checkExists("articles", "article_id", article_id);
      }
      return rows;
    });
};
