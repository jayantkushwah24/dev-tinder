import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = async () => {
  await mongoose.connect("mongodb+srv://jayantkushwah8:Kvoq0xH8Atkla7nP@cluster0.edmb6db.mongodb.net/devTinder");
};
