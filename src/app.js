import express from "express";
import { connectDb } from "../config/database.js";
import User from "../model/user.js";
import { validateSignUpData } from "../utils/validation.js";
import bcrypt, { hash } from "bcrypt";

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
    res.status(400).send("ERROR : ", error.message);
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

  try {
    //validate the data
    validateSignUpData(req);

    //encrypting the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send("error adding the user" + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("email does not exist");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successfully!");
    } else {
      throw new Error("Incorrect Password");
    }
  } catch (error) {
    res.status(400).send("ERROR : ", error.message);
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
