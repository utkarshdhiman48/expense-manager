import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";

interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: Date;
  groups?: string[];
}

interface IUserMethods {
  generateAuthToken(): string;
}

export interface IUserTokenPaylaod {
  name: string;
  email: string;
  id: string;
  phone?: string;
}

const UserSchema = new mongoose.Schema<IUser, {}, IUserMethods>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  groups: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Group",
    required: false,
  },
});

UserSchema.methods.generateAuthToken = function () {
  const payload: IUserTokenPaylaod = {
    name: this.name,
    email: this.email,
    id: this._id.toString(),
    phone: this.phone,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string);
  return token;
};

const User = mongoose.model("User", UserSchema);

export const validate = (user: IUser) => {
  const schema: Joi.ObjectSchema<IUser> = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().allow(null, ""),
    groups: Joi.array().items(Joi.string()).allow(null, ""),
  });

  return schema.validate(user);
};

export const validateUpdateUser = (user: IUser) => {
  const schema: Joi.ObjectSchema<IUser> = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().allow(null, ""),
  });

  return schema.validate(user);
};

export default User;
