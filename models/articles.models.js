const db = require("../db/connection");

exports.retrieveArticle = (article_id) => {
  let article = {};
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      article = rows[0];
    })
    .then(() => {
      return db
        .query(`SELECT COUNT(*) FROM comments WHERE  article_id = $1`, [
          article_id,
        ])
        .then(({ rows }) => {
          article.comment_count = Number(rows[0].count);
          return article;
        });
    });
};

// exports.commentCount = (article_id) => {
//   return db
//     .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
//     .then(({ rows }) => {
//       return rows.length;
//     });
// };

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
