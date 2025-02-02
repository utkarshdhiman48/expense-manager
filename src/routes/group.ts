import Group, {
  validate as validateGroup,
  validateUpdateGroup,
} from "@/models/group";
import Transaction from "@/models/transaction";
import { extractUserId } from "@/models/user";
import express from "express";
import mongoose from "mongoose";

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

router.delete("/:groupId", async (req, res) => {
  const userId = extractUserId(req);
  const deleteTransactions = req.query["delete-transactions"] === "true";

  const group = await Group.findOne({
    _id: req.params.groupId,
    members: userId,
  });
  console.log(userId, req.params.groupId, group);

  if (group === null) return res.status(401).send("Unauthorized");

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      if (deleteTransactions) {
        await Transaction.deleteMany(
          { groupId: req.params.groupId },
          { session }
        );
      } else {
        await Transaction.updateMany(
          { groupId: req.params.groupId },
          { $set: { groupId: null } },
          { session }
        );
      }

      await Group.findByIdAndDelete(req.params.groupId, { session });
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).send("An error occurred while deleting the group");
  } finally {
    await session.endSession();
  }

  res.send("Group deleted");
});

export default router;
