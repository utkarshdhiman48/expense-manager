import mongoose from "mongoose";
import Joi, { ref } from "joi";

interface ITransaction {
  title?: string;
  amount: number;
  description?: string;
  createdBy: string;
  distribution?: {
    amount: number;
    person: string;
  }[];
  type: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
  groupId?: string;
}

interface IUpdateTransaction {
  id: string;
  title?: string;
  amount?: number;
  description?: string;
  distribution?: {
    amount: number;
    person: string;
  }[];
  type?: string;
  groupId?: string;
}

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: false },
  amount: { type: Number, required: true },
  description: { type: String, required: false },
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
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  groupId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Group",
    required: false,
  },
});

export const validate = (transaction: ITransaction) => {
  const schema: Joi.ObjectSchema<ITransaction> = Joi.object().keys({
    title: Joi.string().allow(null, ""),
    amount: Joi.number().required(),
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
    type: Joi.string().valid("inflow", "outflow").required(),
    createdAt: Joi.date().default(Date.now),
    updatedAt: Joi.date().default(Date.now),
    updatedBy: Joi.string().allow(null, ""),
    groupId: Joi.string().allow(null, ""),
  });
  return schema.validate(transaction);
};

export const validateUpdateTransaction = (transaction: IUpdateTransaction) => {
  const schema: Joi.ObjectSchema<ITransaction> = Joi.object().keys({
    id: Joi.string().required(),
    title: Joi.string().allow(null, ""),
    amount: Joi.number().required(),
    description: Joi.string().allow(null, ""),
    distribution: Joi.array()
      .items(
        Joi.object().keys({
          amount: Joi.number().required(),
          person: Joi.string().required(),
        })
      )
      .allow(null),
    type: Joi.string().valid("inflow", "outflow"),
    updatedAt: Joi.date().default(Date.now),
    updatedBy: Joi.string().allow(null, ""),
    groupId: Joi.string().allow(null, ""),
  });

  return schema.validate(transaction);
};

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
