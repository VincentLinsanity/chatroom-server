const path = require("path");
const pathBase = path.resolve(__dirname, "..");

const config = {
  api: {
    port: 3000
  },
  timeout: 30 * 1000
};

module.exports = config;
