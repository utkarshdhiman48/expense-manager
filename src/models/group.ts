import Joi from "joi";
import mongoose from "mongoose";

interface IGroup {
  name: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export function validate(group: IGroup) {
  const schema: Joi.ObjectSchema<IGroup> = Joi.object().keys({
    name: Joi.string().required(),
    members: Joi.array().items(Joi.string()).required(),
    createdBy: Joi.string().required(),
    createdAt: Joi.date().default(Date.now),
    updatedAt: Joi.date().default(Date.now),
  });

  return schema.validate(group);
}

const Group = mongoose.model("Group", GroupSchema);

export default Group;
