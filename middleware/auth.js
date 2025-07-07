import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const userAuth = async (req, res, next) => {
  //read the token from the request cookies
  //validate the token
  //find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is invalid");
    }
    const decodedObj = await jwt.verify(token, "Dev@Tinder$790");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
};
