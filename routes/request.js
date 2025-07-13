import express from "express";
import { userAuth } from "../middleware/auth.js";
import ConnectionRequestModel from "../model/connectionRequest.js";
import User from "../model/user.js";

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type " + status);
      }

      const toUserExist = await User.findById(toUserId);
      if (!toUserExist) {
        throw new Error("User not found");
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists!");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request send successfully.",
        data,
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        status: "interested",
        _id: requestId,
        toUserId: loggedInUser._id,
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found.");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: `connection request has been ${status}`,
        data,
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

export default requestRouter;
