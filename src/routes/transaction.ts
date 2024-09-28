import express from "express";
import Transaction, {
  validate as validateTransaction,
  validateUpdateTransaction,
} from "@/models/transaction";
import jwt from "jsonwebtoken";
import { IUserTokenPaylaod } from "@/models/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateTransaction(req.body);

  if (error) return res.status(400).send(error.message);

  const transaction = new Transaction({
    createdBy: req.body.createdBy, // get current user id from jwt
    amount: req.body.amount,
    distribution: req.body.distribution,
    description: req.body.description,
    title: req.body.title,
    type: req.body.type,
  });

  await transaction.save();

  res.json(transaction);
});

router.patch("/:transactionId", async (req, res) => {
  const { error } = validateUpdateTransaction(req.body);
  if (error) return res.status(400).send(error.message);

  const token = req.headers["x-auth-token"] as string;
  const userId = (jwt.decode(token) as IUserTokenPaylaod).id;

  const updatedTransaction = await Transaction.findOneAndUpdate(
    {
      _id: req.params.transactionId,
      $or: [{ createdBy: userId }, { "distribution.person": userId }],
    },
    {
      $set: {
        ...req.body,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    },
    {
      new: true,
    }
  );

  if (!updatedTransaction) return res.status(404).send("Transaction not found");

  res.json(updatedTransaction);
});

router.delete("/:transactionId", async (req, res) => {
  const token = req.headers["x-auth-token"] as string;
  const userId = (jwt.decode(token) as IUserTokenPaylaod).id;

  const result = await Transaction.deleteOne({
    _id: req.params.transactionId,
    $or: [{ createdBy: userId }, { "distribution.person": userId }],
  });

  if (result.deletedCount === 0)
    return res.status(404).send("Transaction not found");

  res.status(200).send("Transaction deleted");
});

export default router;
