const db = require("../db/connection");
const { checkExists } = require("../utils/utils");

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

exports.sendComment = (id, message) => {
  if (message.username === undefined || message.body === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid Input!" });
  } else if (
    typeof message.username !== "string" ||
    typeof message.body !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Input!" });
  }

  const { article_id } = id;
  const { username, body } = message;

  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment does not exist!" });
      }
      return rows;
    });
};
