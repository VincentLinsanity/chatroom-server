const config = require("./config");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const json = require("body-parser").json;
const urlencoded = require("body-parser").urlencoded;
const routes = require("./routes");
const ws = require("./libs").ws;
ws.setup(server);

app.use(json());
app.use(
  urlencoded({
    extended: false
  })
);

routes.setup(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,Content-Type,Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.use(function(err, req, res, next) {
  console.error({
    err
  });
  next();
});

process.on("uncaughtException", function(err) {
  console.error(err); // handle the error safely
});

server.listen(config.api.port, function() {
  console.log(`Api server listening on port: ${config.api.port}`);
});
