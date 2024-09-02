import User, { validate as validateUser } from "@/models/user";
import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(400).send("Email already in use");

  const hashedPassword = await hashPassword(req.body.password);
  const user = new User({
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
  });

  await user.save();
  const token = user.generateAuthToken();

  res.header("x-auth-token", token).sendStatus(201);
});

export default router;
