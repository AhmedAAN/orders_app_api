import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import connectToDatabase from "../database";
import { hashPassword } from "../utils/hashing";

interface User {
	id?: number;
	username: string;
	email: string;
	password: string;
	created_at?: Date;
}

interface DatabaseError extends Error {
	code?: number;
	email?: boolean;
	password?: boolean;
}

export class UserModel {
	static async createUser(user: User): Promise<number> {
		user.password = await hashPassword(user.password);
		const query =
			"INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";

		return connectToDatabase().then((connection) => {
			return new Promise((resolve, reject) => {
				connection.query(
					query,
					[user.username, user.email, user.password],
					(err: QueryError | null, result: ResultSetHeader) => {
						if (err) {
							if (err.errno == 1062) {
								const error: DatabaseError = new Error("Email already used");
								error.code = 409;
								reject(error);
							} else {
								const error: DatabaseError = new Error(err.message);
								error.code = 500;
								reject(error);
							}
							return;
						}

						resolve(result.insertId);
					}
				);
			});
		});
	}

	static async checkEmail(email: string): Promise<boolean> {
		const query = "SELECT email FROM users WHERE email = ?";

		return connectToDatabase().then((connection) => {
			return new Promise((resolve, reject) => {
				connection.query(
					query,
					[email],
					(err: QueryError | null, result: RowDataPacket[]) => {
						if (err) {
							const error: DatabaseError = new Error(err.message);
							error.code = 500;
							reject(error);
							return;
						}
						if (result.length > 0) {
							const error: DatabaseError = new Error("Email already exists!");
							error.email = true;
							error.code = 401;
							reject(error);
						} else {
							resolve(true);
						}
					}
				);
			});
		});
	}

	static async createGuest(userName: string): Promise<number> {
		const query = "INSERT INTO users (username) VALUES (?)";

		return connectToDatabase().then((connection) => {
			return new Promise((resolve, reject) => {
				connection.query(
					query,
					[userName],
					(err: QueryError | null, result: ResultSetHeader) => {
						if (err) {
							const error: DatabaseError = new Error(err.message);
							error.code = 500;
							reject(error);

							return;
						}

						resolve(result.insertId);
					}
				);
			});
		});
	}

	static async getUserById(id: string) {
		const query = "SELECT id, username, email FROM users WHERE id = ?";

		return connectToDatabase().then((connection) => {
			return new Promise((resolve, reject) => {
				connection.query(
					query,
					[id],
					(err: QueryError | null, result: RowDataPacket[]) => {
						if (err) {
							const error: DatabaseError = new Error(err.message);
							error.code = 500;
							reject(error);
							return;
						}
						if (result.length > 0) {
							resolve(result[0]);
						} else {
							const error: DatabaseError = new Error("User not found");
							error.code = 404;
							reject(error);
						}
					}
				);
			});
		});
	}

	static async getHashPassword(
		email: string
	): Promise<{ password_hash: string; id: number; username: string }> {
		const query =
			"SELECT password_hash, id, username FROM users WHERE email = ?";

		return connectToDatabase().then((connection) => {
			return new Promise((resolve, reject) => {
				connection.query(
					query,
					[email],
					(err: QueryError | null, result: RowDataPacket[]) => {
						if (err) {
							const error: DatabaseError = new Error(err.message);
							error.code = 500;
							reject(error);
							return;
						}
						const rows = result;
						if (rows.length > 0) {
							resolve(
								rows[0] as {
									password_hash: string;
									id: number;
									username: string;
								}
							);
						} else {
							const error: DatabaseError = new Error(
								"Email is not registered!"
							);
							error.email = true;
							error.code = 401;
							reject(error);
						}
					}
				);
			});
		});
	}
	static async changePassword(id: number, new_password: string) {
		const hashed_password = await hashPassword(new_password);

		const query = "UPDATE users SET password_hash = ? WHERE id = ?";

		return connectToDatabase().then((connection) => {
			return new Promise((resolve, reject) => {
				connection.query(query, [hashed_password, id], (err, result) => {
					if (err) {
						reject(err);
					}
					resolve(result);
				});
			});
		});
	}
}
