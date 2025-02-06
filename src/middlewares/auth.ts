import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { IUserTokenPaylaod, RequestWithUser } from "@/models/user";

const authenticateUser = (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers["x-auth-token"];

	if (!token || typeof token !== "string") {
		return res.status(403).json({ message: "Access denied, token missing." });
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid or expired token." });
		}

		req.user = user as IUserTokenPaylaod; // assuming token contains all the required keys since it's been validated
		next(); // Proceed to the next middleware or route handler
	});
};

export default authenticateUser;
