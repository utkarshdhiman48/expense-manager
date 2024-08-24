import mongoose from "mongoose";

const connectDb = () =>
  mongoose
    .connect(process.env.DB_URL!, { dbName: process.env.DB_NAME! })
    .then(() => console.log("Connected to mongodb"));

export default connectDb;
