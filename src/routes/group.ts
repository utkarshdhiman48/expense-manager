import Group, {
  validate as validateGroup,
  validateUpdateGroupName,
} from "@/models/group";
import Transaction from "@/models/transaction";
import { IUserTokenPaylaod } from "@/models/user";
import jwt from "jsonwebtoken";
import express from "express";

const router = express.Router();

router.get("/:groupId/transactions", async (req, res) => {
  const { groupId } = req.params;

  const transactions = await Transaction.find({ groupId });

  res.json(transactions);
});

router.post("/", async (req, res) => {
  const { error } = validateGroup(req.body);
  if (error) return res.status(400).send(error.message);

  const group = await Group.create(req.body);

  res.status(201).json({ id: group._id, name: group.name });
});

router.patch("/:groupId/name", async (req, res) => {
  const { error } = validateUpdateGroupName(req.body);
  if (error) return res.status(400).send(error.message);

  const token = req.headers["x-auth-token"] as string;
  const userId = (jwt.decode(token) as IUserTokenPaylaod).id;

  const group = await Group.findOneAndUpdate(
    {
      _id: req.params.groupId,
      members: userId,
    },
    { $set: { name: req.body.name, updatedAt: new Date() } },
    { new: true }
  );

  if (group === null) return res.status(404).send("Group not found");

  res.json(group);
});

router.patch("/:groupId/members", async (req, res) => {
  const { error } = validateUpdateGroupName(req.body);
  if (error) return res.status(400).send(error.message);

  const token = req.headers["x-auth-token"] as string;
  const userId = (jwt.decode(token) as IUserTokenPaylaod).id;

  const group = await Group.findOneAndUpdate(
    {
      _id: req.params.groupId,
      members: userId,
    },
    { $set: { members: req.body.members, updatedAt: new Date() } },
    { new: true }
  );

  if (group === null) return res.status(404).send("Group not found");

  res.json(group);
});

export default router;
