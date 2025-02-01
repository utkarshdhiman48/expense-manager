import Group, {
  validate as validateGroup,
  validateUpdateGroup,
} from "@/models/group";
import Transaction from "@/models/transaction";
import { extractUserId } from "@/models/user";
import express from "express";

const router = express.Router();

router.get("/:groupId/transactions", async (req, res) => {
  const { groupId } = req.params;

  const transactions = await Transaction.find({ groupId });
  // TODO: paginate the transactions or limit them somehow

  res.json(transactions);
});

router.post("/", async (req, res) => {
  const { error } = validateGroup(req.body);
  if (error) return res.status(400).send(error.message);

  const group = await Group.create(req.body);

  res.status(201).json({ id: group._id, name: group.name });
});

router.patch("/:groupId", async (req, res) => {
  const { error } = validateUpdateGroup(req.body);
  if (error) return res.status(400).send(error.message);

  const userId = extractUserId(req);

  const update = {} as any;

  if (req.body.name) {
    update.name = req.body.name;
  }

  if (req.body.members) {
    update.members = req.body.members;
  }

  if (!Object.keys(update).length)
    return res.status(400).send("No update provided");

  const group = await Group.findOneAndUpdate(
    {
      _id: req.params.groupId,
      members: userId,
    },
    { $set: { ...update, updatedAt: new Date() } },
    { new: true }
  );

  if (group === null) return res.status(404).send("Group not found");

  res.json(group);
});

export default router;
