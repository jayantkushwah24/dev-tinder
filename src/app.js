import express from "express";
import { connectDb } from "../config/database.js";
import User from "../model/user.js";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth.js";
import profileRouter from "../routes/profile.js";
import requestRouter from "../routes/request.js";

const app = express();
const PORT = 7777;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("database is successfully connected");
    app.listen(PORT, () => {
      console.log("server is listening on port " + PORT);
    });
  })
  .catch((error) => console.log("error" + error.message));
