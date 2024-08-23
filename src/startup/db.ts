import mongoose from "mongoose";

const connectDb = () => mongoose.connect(process.env.DB_URL!).then(()=>console.log("Connected to mongodb"));

export default connectDb;