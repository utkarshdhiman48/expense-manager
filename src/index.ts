import express from "express";
import "dotenv/config";
import transaction from "@/routes/transaction";
import user from "@/routes/user";
import auth from "@/routes/auth";
import group from "@/routes/group";
import connectDb from "@/startup/db";
import authenticateUser from "./middlewares/auth";

const PORT = process.env.PORT;
const app = express();

connectDb();
app.use(express.json());

// Public routes
app.use("/api/auth", auth);
app.get("/", (req, res) => {
	res.send("You got it!");
});

// Authenticated routes
app.use(authenticateUser);
app.use("/api/transaction", transaction);
app.use("/api/user", user);
app.use("/api/group", group);

app.listen(PORT, () => console.log("listening on: ", PORT));

export default app;
