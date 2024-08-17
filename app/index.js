require("dotenv").config();
const express = require("express");
const swaggerSetup = require("../swagger");
const initDB = require("./config/db");
const app = express();
const port = process.env.PORT || 4000;


swaggerSetup(app);

require("./app/routes")(app);


initDB().then(() =>
  app.listen(port, () => console.info(`listening on port ${port}`))
);

