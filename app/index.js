require("dotenv").config();

const swaggerSetup = require("../swagger");
const initDB = require("./config/db");
const app = require("./app");

const port = process.env.PORT || 4000;

swaggerSetup(app);

initDB().then(() =>
  app.listen(port, () => console.info(`listening on port ${port}`))
);
