import User from "@/models/user";
import express from "express";
import bcrypt from "bcrypt";
import Joi from "joi";

function validateUser(user: { email: string; password: string }) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(user);
}

const router = express.Router();

router.post("/login", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("User not found");

  const passwordMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordMatched) return res.status(400).send("Invalid password");

  const token = user.generateAuthToken();

  return res.header("x-auth-token", token).json({
    name: user.name,
    email: user.email,
    id: user._id,
    phone: user.phone,
  });
});

export default router;
