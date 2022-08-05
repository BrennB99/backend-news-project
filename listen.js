const app = require("./app.js");

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => console.log(`Listening on ${port}...`));
