import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";

interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt?: Date;
}

interface IUserMethods {
  generateAuthToken(): string;
}

const UserSchema = new mongoose.Schema<IUser, {}, IUserMethods>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { name: this.name, email: this.email, id: this._id, phone: this.phone },
    process.env.JWT_SECRET_KEY as string
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

export const validate = (user: IUser) => {
  const schema: Joi.ObjectSchema<IUser> = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().allow(null, ""),
    createdAt: Joi.date().default(Date.now),
  });
  return schema.validate(user);
};

export default User;
