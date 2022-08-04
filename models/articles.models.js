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

exports.retrieveArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBys = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  const validOrders = ["ASC", "DESC"];
  const validTopics = ["mitch", "cats", "paper"];
  const topics = [];

  if (
    !validSortBys.includes(sort_by) ||
    !validOrders.includes(order) ||
    (!validTopics.includes(topic) && topic !== undefined)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid search query!" });
  }

  let string = `SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `;
  if (topic) {
    string += `WHERE articles.topic = $1 `;
    topics.push(topic);
  }
  string += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(string, topics).then(({ rows }) => {
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
