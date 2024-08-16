require("dotenv").config();
const express = require("express");
const swaggerSetup = require('./swagger'); 

const app = express();

swaggerSetup(app);
require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 4000;
app.listen(port, () => console.info(`listening on port ${port}`));
