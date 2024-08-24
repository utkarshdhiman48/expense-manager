import express from "express";
import "dotenv/config";
import transactions from "@/routes/transactions";
import connectDb from "@/startup/db";

const PORT = process.env.PORT;
const app = express();

connectDb();
app.use(transactions);

app.get("/", (req, res) => {
  res.send("You got it!");
});

app.listen(PORT, () => console.log("listening on: ", PORT));

export default app;
