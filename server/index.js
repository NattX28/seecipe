const PORT = 5000;
const express = require("express");
const { readdirSync } = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);

readdirSync("./src/routes").forEach((file) => {
  const route = require(path.join(__dirname, "src", "routes", file));
  app.use("/", route);
});

app.listen(PORT, console.log(`server run on port ${PORT} Success`));
