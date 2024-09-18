import express from "express";
import Transaction, {
  validate as validateTransaction,
} from "@/models/transaction";

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

export default router;
