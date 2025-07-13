import express from "express";
import User from "../model/user.js";
import bcrypt from "bcrypt";
import { validateSignUpData } from "../utils/validation.js";
const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
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
    res.status(400).send(" error adding the user" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("email does not exist");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJWT();

      //add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      });
      res.send("Login successfully!");
    } else {
      throw new Error("Incorrect Password");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout successfull");
});

export default authRouter;
