import Joi from "joi";
import mongoose from "mongoose";

interface IConnection {
  user1: string;
  user2: string;
  createdAt?: Date;
}

const ConnectionSchema = new mongoose.Schema({
  user1: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  user2: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Connection = mongoose.model("Connection", ConnectionSchema);

export function validate(connection: IConnection) {
  const schema = Joi.object({
    user1: Joi.string().required(),
    user2: Joi.string().required().valid(Joi.ref("user1")).messages({
      "any.only": "user1 and user2 must be distinct",
    }),
  });

  return schema.validate(connection);
}

export default Connection;
