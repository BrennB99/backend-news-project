const request = require("supertest");
const db = require("../db/connection");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api/:invalidPath", () => {
  test("Status code 404 and invalid path messgae when given incorrect path", () => {
    return request(app)
      .get("/api/yearWritten")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path does not exist");
      });
  });
});

describe("GET /api/topics", () => {
  test("Status: 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("Should return array of topics", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach(() => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("Status 200 and returns correct array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        articles.forEach(() => {
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Status: 200", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("Should return an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status 404 and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article does not exist");
      });
  });
  test("status 400 and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not_an_article")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid ID!");
      });
  });
  test("Should return an article object with comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual(
          expect.objectContaining({
            comment_count: "11",
          })
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 201 and returns updated article", () => {
    const changeVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(changeVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 105,
          })
        );
      });
  });
  test("status 400 and error message when given invalid body key", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ notValid: 5 })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Input!");
      });
  });
  test("status 400 and error message when give invalid body value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "Not valid" })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Input!");
      });
  });
});

describe("GET /api/users", () => {
  test("Status 200 and returns array containing correct objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach(() => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Status 200 and should return array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        comments.forEach(() => {
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("status 404 and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article does not exist");
      });
  });
  test("status 400 and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not_an_article/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid ID!");
      });
  });
  test("Status 200 and empty array when given a valid ID with no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Status 201 and responds with object of comment", () => {
    const comment = { username: "icellusedkars", body: "Nice" };
    return request(app)
      .post("/api/articles/7/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 7,
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: "icellusedkars",
            body: "Nice",
          })
        );
      });
  });
  test("status 400 and error message when given invalid key", () => {
    const comment = { name: "icellusedkars", body: "Nice" };
    return request(app)
      .post("/api/articles/7/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Input!");
      });
  });
  test("status 400 and error message when given incomplete input", () => {
    const comment = { username: "icellusedkars" };
    return request(app)
      .post("/api/articles/7/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Input!");
      });
  });
  test("status 400 and error message when give invalid body value", () => {
    const comment = { username: "icellusedkars", body: 909 };
    return request(app)
      .post("/api/articles/7/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Input!");
      });
  });
});

describe("GET /api/articles?queries", () => {
  test("If no search query is passed, default sort criteria to descending date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("returns articles sorted by passed sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("topic", {
          descending: true,
        });
      });
  });
  test("status: 400 and correct message if passed invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=length")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid search query!");
      });
  });
  test("returns articles sorted by passed order query", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("status: 400 and correct message if passed invalid order query", () => {
    return request(app)
      .get("/api/articles?order=length")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid search query!");
      });
  });
  test("status:200 and return correct array when passed a topic filter", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach(() => {
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("status: 400 and correct message if passed invalid order query", () => {
    return request(app)
      .get("/api/articles?topic=length")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid search query!");
      });
  });
  test("status:200 and returns empty array for topic that exists but doesnt have any articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(0);
      });
  });
  test("returns correctly formatted articles when passed multiple queries", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("title", {
          ascending: true,
        });
        articles.forEach(() => {
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status: 204 and no returned content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("status 404 when trying to delete a valid but non existent comment", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Comment does not exist!");
      });
  });
  test("status 400 when using an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/test")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid ID!");
      });
  });
});
