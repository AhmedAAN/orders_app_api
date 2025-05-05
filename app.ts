import { app } from "./server";
import userRoutes from "./routes/userRoutes";

app.use("/users", userRoutes);
/* import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

require("dotenv").config();
const app = express();
app.use(express.json());

const users: { username: any; password: any }[] = []; // Mock user data, replace with a database

// JWT secrets and expiration times
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
	process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

let refreshTokens: any[] = []; // Mock refresh tokens, replace with a database

// User registration
app.post("/register", async (req, res) => {
	const { username, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	users.push({ username, password: hashedPassword });
	console.log(users);
	const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRY,
	});
	const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRY,
	});

	refreshTokens.push(refreshToken);
	res.status(201).json({ accessToken, refreshToken });
});

// User login

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = users.find((u) => u.username === username);
	console.log(user + " log in to our api");

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).send("Invalid credentials");
	}

	const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRY,
	});
	const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRY,
	});

	refreshTokens.push(refreshToken);
	res.json({ accessToken, refreshToken });
});

// Token refresh
app.post("/refresh", (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken || !refreshTokens.includes(refreshToken)) {
		return res.status(403).send("Refresh token invalid");
	}

	jwt.verify(
		refreshToken,
		REFRESH_TOKEN_SECRET,
		(err: any, user: { username: any }) => {
			if (err) return res.status(403).send("Refresh token invalid");

			const accessToken = jwt.sign(
				{ username: user.username },
				ACCESS_TOKEN_SECRET,
				{ expiresIn: ACCESS_TOKEN_EXPIRY }
			);
			res.json({ accessToken });
		}
	);
});

// Logout
app.post(
	"/logout",
	(
		req: { body: { refreshToken: any } },
		res: { send: (arg0: string) => void }
	) => {
		const { refreshToken } = req.body;
		refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
		res.send("Logged out");
	}
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 */
