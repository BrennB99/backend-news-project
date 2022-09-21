# NC News

This project serves as a backend for the NC News website. The server allows for creating, reading, updating and deleting articles, comments and votes from the database.

The server is implemented in Node.js, using express as the framework. The database used is PostgreSql.

A hosted version of this server can be seen here:

```
https://nc-news-bb.herokuapp.com/api
```

### Prerequisites

Ensure you have node.js installed.
To check if node.js is installed, in the terminal run

```
node -v
```

If no version is printed to the console, install node.js by visiting:

```
https://nodejs.org/en/download/
```

Ensure you have PostgreSQL installed.
To check if PostgreSQL is installed, in the terminal run

```
which psql
```

If a file path is not printed to the console, install PostgreSQL by visiting:

```
https://www.postgresql.org/download/
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

To use this server locally:

1. Clone the repo:

```
git clone https://github.com/BrennB99/backend-news-project
```

2. Install NPM packages:

```
npm install
```

3. Create .env files:

```
touch .env.test && touch .env.development
```

4. Paste into .env.test:

```
PGDATABASE=nc_news_test
```

5. Paste into .env.development:

```
PGDATABASE=nc_news
```

6. Run the server locally with:

```
node app.js
```

## Endpoints

To view all available endpoints visit

```
localhost:port_number/api
```

By default this is

```
localhost:9090/api
```

## Running the tests

To run the tests

```
npm test
```

The tests cover:

- GET requests for: topics, articles, article by its ID, users, comments for an article.
- POST requests for: Comments.
- DELETE requests for: Comments.
- PATCH requests for: Article votes.
- Sort querys for: Articles.
- Error handling for all of the above.

## Deployment

Due to heroku ending its free tiers I recommend you use render to deploy this server on a live system:

```
https://render.com/
```

A clear guide on how to do his can be found here

```
https://www.freecodecamp.org/news/how-to-deploy-nodejs-application-with-render/
```

## Built With

- cors: 2.8.5
- dotenv: 16.0.0
- express: 4.18.1
- pg: 8.7.3
- pg-format: 1.0.4
- husky: 7.0.0
- jest: 27.5.1
- jest-extended: 2.0.0
- jest-sorted: 1.0.14
- supertest: 6.2.4
