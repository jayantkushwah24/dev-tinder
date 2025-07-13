import express from "express";
import { userAuth } from "../middleware/auth.js";
import ConnectionRequestModel from "../model/connectionRequest.js";

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills about";

//get all the pending connection request of loggedin user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    //if you dont pass second parameter in .populate then it will show all the data so to avoid overfetching mention the field specifically

    res.json({
      message: "fetched all the pending connection request successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.messsage);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    if (!connectionRequests) {
      throw new Error("Connections not found.");
    }
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: "connections fetched successfully",
      data,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

export default userRouter;
