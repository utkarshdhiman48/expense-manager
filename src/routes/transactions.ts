import express from "express";
import Transaction from "../models/transaction";

const router = express.Router();

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

export default router;
