import mongoose from "mongoose";
import transaction from "../models/transaction";

const connectDb = () =>
  mongoose
    .connect(process.env.DB_URL!, { dbName: "expense-manager" })
    .then(() => console.log("Connected to mongodb"));

export default connectDb;
