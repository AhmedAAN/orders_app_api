import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
	process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
	throw Error("No JWT secret key added");
}

export const createAccessToken = (id: number) => {
	const token = jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRY,
	});
	return token;
};

export const authenticateAccessToken = (token: string) => {
	const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
	return decoded.id;
};

export const createRefrshToken = (id: number) => {
	const token = jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRY,
	});
	return token;
};

export const authenticateRefreshToken = (token: string) => {
	const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
	return decoded.id;
};

export const createGuestToken = (id: number) => {
	const token = jwt.sign({ id }, ACCESS_TOKEN_SECRET);
	return token;
};
