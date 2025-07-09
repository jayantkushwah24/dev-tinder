import express from "express";
import { userAuth } from "../middleware/auth.js";

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent you a connection request. ");
});

export default requestRouter;
