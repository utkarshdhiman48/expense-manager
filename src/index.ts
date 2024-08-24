import express from "express";
import "dotenv/config";
import connectDb from "./startup/db";

const PORT = process.env.PORT;
const app = express();

connectDb();

app.listen(PORT, () => console.log("listening on: ", PORT));

export default app;
