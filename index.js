const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv");
const app = express();
app.use(bodyparser.json({ extended: true }));
app.use(express.json());

dotenv.config();
app.use("/user", userRoutes);

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASS;

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occurred" });
});

mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.o3vsgrd.mongodb.net/schizer?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DataBase is connected Successfully!!");
    app.listen(5000);
  })
  .catch(() => {
    console.error("Error from DataBase");
  });
