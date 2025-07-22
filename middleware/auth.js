import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const userAuth = async (req, res, next) => {
  //read the token from the request cookies
  //validate the token
  //find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Please login to access this route." });
    }
    const decodedObj = await jwt.verify(token, "Dev@Tinder$790");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
