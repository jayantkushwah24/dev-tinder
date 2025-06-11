import express from "express";
import { connectDb } from "../config/database.js";
import User from "../model/user.js";
const app = express();
const PORT = 7777;

app.post("/signup", async (req, res, next) => {
  //creating a new instance of a model
  const user = new User({
    firstName: "jayant",
    lastName: "kushwah",
    email: "jk@gmail.com",
    password: "zxysj",
  });
  try {
    await user.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send("error adding the user" + error.message);
  }
});

connectDb()
  .then(() => {
    console.log("database is successfully connected");
    app.listen(PORT, () => {
      console.log("server is listening on port", PORT);
    });
  })
  .catch((error) => console.log("error"));
