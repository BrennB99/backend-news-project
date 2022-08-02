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
            comment_count: 11,
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
