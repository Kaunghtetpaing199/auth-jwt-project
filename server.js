if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//import package
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");

//import file
const router = require("./routes/routes");

//create server
const server = express();

//middleware
const rootDir = path.dirname(process.mainModule.filename);
server.use(express.static(path.join(rootDir, "public")));
server.use(express.json());
server.use(cookieParser());

//view engine
server.set("view engine", "ejs");

//create route
server.use("/", router);

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((res) => {
    server.listen(port, () =>
      console.log(`Server start running at port ${port}`)
    );
  })
  .catch((err) => console.log(err));
