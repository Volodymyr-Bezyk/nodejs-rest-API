const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const logger = require("morgan");
const routerApi = require("./routes/api");
const routerRegister = require("./routes/auth");
const routerFiles = require("./routes/files");
const { errorHandler, wrongPathHandler } = require("./helpers");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api", routerRegister);
app.use("/api", routerApi);
app.use("/", routerFiles);

app.use((_, res, __) => wrongPathHandler(_, res, __));
app.use((err, _, res, __) => errorHandler(err, _, res, __));

const uriDb = process.env.DB_HOST;
const PORT = process.env.PORT || 3000;

const connection = mongoose.connect(uriDb, {
  dbName: "db-contacts",
});

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(
        `Database connection successful. Use our API on port: ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
