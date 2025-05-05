import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { ConfirmationModel } from "../models/confirmationModel";
import { verifyPassword } from "../utils/hashing";
import {
	createAccessToken,
	createGuestToken,
	createRefrshToken,
} from "../utils/jwt";

export class UserController {
	static async login(req: Request, res: Response) {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({
				error: {
					message: "Email and Password are required",
					email: true,
					password: true,
				},
			});
			return;
		}

		try {
			const databaseRes = await UserModel.getHashPassword(email);
			await verifyPassword(password, databaseRes.password_hash);
			const accessToken = createAccessToken(databaseRes.id);
			const refreshToken = createRefrshToken(databaseRes.id);

			res
				.status(200)
				.json({ accessToken, refreshToken, username: databaseRes.username });
		} catch (err: any) {
			const statusCode = err.code || 500;
			res.status(statusCode).json({
				error: {
					message: err.message,
					email: err.email || false,
					password: err.password || false,
				},
			});
		}
	}

	static async signUp(req: Request, res: Response) {
		const { username, email, password } = req.body;
		if (!email || !password || !username) {
			res.status(400).json({
				error: {
					message: "All data is required",
				},
			});
			return;
		}

		try {
			const id = await UserModel.createUser({ username, email, password });
			const accessToken = createAccessToken(id);
			const refreshToken = createRefrshToken(id);

			res.status(200).json({ accessToken, refreshToken, username: username });
		} catch (err: any) {
			const statusCode = err.code || 500;
			res.status(statusCode).json({
				message: err.message,
			});
		}
	}

	static async getCode(req: Request, res: Response) {
		const { email } = req.body;

		if (!email) {
			res.status(400).json({
				error: {
					message: "Email is required",
					email: true,
				},
			});
			return;
		}

		try {
			await UserModel.checkEmail(email);
			const randomNum = Math.random() * 9000;
			const confirmationCode = Math.floor(1000 + randomNum).toString();
			await ConfirmationModel.insertCode(email, confirmationCode);

			res.status(200).json({ confirmationCode: confirmationCode });
		} catch (err: any) {
			const statusCode = err.code || 500;
			res.status(statusCode).json({
				error: {
					message: err.message,
					email: err.email || false,
				},
			});
		}
	}

	static async checkCode(req: Request, res: Response) {
		const { email, code } = req.body;
		if (!email || !code) {
			res.status(400).json({
				error: {
					message: "All data is required",
				},
			});
			return;
		}

		try {
			const confirmationCode = (await ConfirmationModel.getCode(email))
				.confirmation_code;

			if (confirmationCode != code) {
				res.status(400).json({
					error: {
						message: "OTP is incorrect!",
					},
				});
				return;
			}

			res.status(200);
		} catch (err: any) {
			const statusCode = err.code || 500;
			res.status(statusCode).json({
				message: err.message,
			});
		}
	}
	static async createGuest(req: Request, res: Response) {
		const { username } = req.body;
		if (!username) {
			res.status(400).json({
				error: {
					message: "User name is required",
				},
			});
			return;
		}

		try {
			const id = await UserModel.createGuest(username);
			const accessToken = createAccessToken(id);
			const refreshToken = createGuestToken(id);

			res.status(200).json({ accessToken, refreshToken, username: username });
		} catch (err: any) {
			const statusCode = err.code || 500;
			res.status(statusCode).json({
				message: err.message,
			});
		}
	}
}
