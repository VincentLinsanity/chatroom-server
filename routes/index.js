const express = require("express");
const chat = require("./chat");

const routes = {
  setup: app => {
    // setup routes
    const api = express.Router();
    api.use("/chat", chat);
    app.use("/api", api);
  }
};

module.exports = routes;
