import express from "express";
import "dotenv/config";
import transactions from "@/routes/transactions";
import user from "@/routes/user";
import connectDb from "@/startup/db";

const PORT = process.env.PORT;
const app = express();

connectDb();
app.use(express.json());
app.use("/api/transactions", transactions);
app.use("/api/user", user);

app.get("/", (req, res) => {
  res.send("You got it!");
});

app.listen(PORT, () => console.log("listening on: ", PORT));

export default app;
