const cors = require("cors");
const passport = require("passport");

const app = require("./routes");
const { route } = require("./routes");
const { jwtAuth } = require("./config/authentication");

jwtAuth();

app.use(passport.initialize());
app.use(cors());
app.use("/api/v1", route);

module.exports = app;
