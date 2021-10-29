require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

const galleryItems = require("./routes/gallery");
const errorHandler = require("./helpers/errorResponse");
const adminPages = require("./routes/admin");
const authorizeUser = require("./routes/authorized");

app.use(adminPages);
app.use(galleryItems);
app.use(authorizeUser);
app.use(errorHandler);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on ${port}`));
