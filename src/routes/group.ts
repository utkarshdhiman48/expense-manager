import Group, { validate as validateGroup } from "@/models/group";
import Transaction from "@/models/transaction";
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

export default router;
