import User, { validate as validateUser } from "@/models/user";
import express from "express";
import bcrypt from "bcrypt";
import Transaction from "@/models/transaction";

const router = express.Router();

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

router.get("/:userId/transactions", async (req, res) => {
  const { userId } = req.params;

  let query = {};
  if (req.query.onlyCreatedByMe === "true") {
    query = { createdBy: userId };
  } else {
    query = {
      $or: [{ createdBy: userId }, { "distribution.person": userId }],
    };
  }

  const transactions = await Transaction.find(query);

  res.json(transactions);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(400).send("Email already in use");

  const hashedPassword = await hashPassword(req.body.password);

  const user = new User({
    email: req.body.email,
    phone: req.body.phone,
    name: req.body.name,
    password: hashedPassword,
  });

  await user.save();
  const token = user.generateAuthToken();

  res
    .status(201)
    .header("x-auth-token", token)
    .json({ email: user.email, id: user._id, name: user.name });
});

export default router;
