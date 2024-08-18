const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const Path = require("path");
const { readdirSync, lstatSync } = require("fs");



app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

const modulesDirContent = readdirSync(Path.join(__dirname, "../modules"));

modulesDirContent.forEach((item) => {
  const currentItemPath = Path.join(__dirname, `../modules/${item}`);
  const isDirectory = lstatSync(currentItemPath).isDirectory();

  if (isDirectory) {
    const routerFilePath = Path.join(
      __dirname,
      `../modules/${item}/${item}.router.js`
    );

    const module = require(routerFilePath);

    if (module) {
      app.use(module);
    }
  }
});


module.exports = app;
