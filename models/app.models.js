const fs = require("fs/promises");
const endpoints = require("../endpoints.json");

exports.retrieveApi = async () => {
  const data = await fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((endpoints) => {
      return JSON.parse(endpoints);
    });

  return data;
};
