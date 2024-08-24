import mongoose from "mongoose";
import Joi from "joi";

interface ITransaction {
  title?: string;
  value: number;
  description?: string;
  createdBy: string;
  distribution?: {
    amount: number;
    person: string;
  }[];
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: false },
  value: { type: Number, required: true },
  description: { type: String, required: false },
  createdBy: { type: mongoose.SchemaTypes.ObjectId, required: true },
  distribution: {
    type: [
      {
        amount: { type: Number, required: true },
        person: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
        },
      },
    ],
    required: false,
  },
  type: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const validate = (transaction: ITransaction) => {
  const schema: Joi.ObjectSchema<ITransaction> = Joi.object().keys({
    title: Joi.string().allow(null, ""),
    value: Joi.number().required(),
    description: Joi.string().allow(null, ""),
    createdBy: Joi.string().required(),
    distribution: Joi.array()
      .items(
        Joi.object().keys({
          amount: Joi.number().required(),
          person: Joi.string().required(),
        })
      )
      .allow(null),
    type: Joi.string().required(),
    createdAt: Joi.date().default(Date.now),
    updatedAt: Joi.date().default(Date.now),
  });
  return schema.validate(transaction);
};

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
