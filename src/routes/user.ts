import User, {
  IUserTokenPaylaod,
  validate as validateUser,
} from "@/models/user";
import express from "express";
import bcrypt from "bcrypt";
import Transaction from "@/models/transaction";
import jwt from "jsonwebtoken";
import Connection, {
  validate as validateConnection,
} from "@/models/connection";

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
  if (error) return res.status(400).send(error.message);

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

router.post("/connect", async (req, res) => {
  const token = req.headers["x-auth-token"] as string;
  const senderUserId = (jwt.decode(token) as IUserTokenPaylaod).id;
  const payload = { user1: req.body.user, user2: senderUserId };

  const { error } = validateConnection(payload);
  if (error) return res.status(400).send(error.message);

  const bothUsersExist =
    (await User.countDocuments({
      _id: { $in: [req.body.user, senderUserId] },
    })) === 2;
  if (!bothUsersExist) return res.status(404).send("User not found");

  const connectionAlreadyExists = await Connection.findOne({
    $or: [
      { user1: req.body.user, user2: senderUserId },
      { user1: senderUserId, user2: req.body.user },
    ],
  });

  if (connectionAlreadyExists)
    return res.status(400).send("Connection already exists");

  const connection = new Connection({
    user1: req.body.user,
    user2: senderUserId,
  });

  await connection.save();

  return res.status(201).json({ id: connection._id });
});

export default router;
