import express from "express";
import Transaction, {
  validate as validateTransaction,
} from "@/models/transaction";

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateTransaction(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const transaction = new Transaction({
    createdAt: new Date(),
    updatedAt: new Date(),
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

router.get("/:userId/", async (req, res) => {
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

export default router;
