import express from "express";
import "dotenv/config";
import transaction from "@/routes/transaction";
import user from "@/routes/user";
import auth from "@/routes/auth";
import group from "@/routes/group";
import connectDb from "@/startup/db";

const PORT = process.env.PORT;
const app = express();

connectDb();
app.use(express.json());
app.use("/api/transaction", transaction);
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/group", group);

app.get("/", (req, res) => {
  res.send("You got it!");
});

app.listen(PORT, () => console.log("listening on: ", PORT));

export default app;
