const app = require("./src/app");
const config = require("./src/config/environment");

const server = app.listen(
  config.PORT,
  console.log(
    `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
  )
);
