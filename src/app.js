import express from "express";
import { connectDb } from "../config/database.js";
import User from "../model/user.js";
const app = express();
const PORT = 7777;
app.use(express.json());

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.post("/signup", async (req, res, next) => {
  //creating a new instance of the user model
  const user = new User(req.body);
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
