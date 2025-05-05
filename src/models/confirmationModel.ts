import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import connectToDatabase from "../database";

interface DatabaseError extends Error {
	code?: number;
	email?: boolean;
	password?: boolean;
}

export class ConfirmationModel {
	static async getCode(email: string): Promise<{
		confirmation_code: string;
	}> {
		const query =
			"SELECT confirmation_code FROM confirmations WHERE email = ? ORDER BY created_at DESC LIMIT 1";

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
							resolve(
								result[0] as {
									confirmation_code: string;
								}
							);
						} else {
							const error: DatabaseError = new Error(
								"No confirmation code found"
							);
							error.code = 400;
							reject(error);
						}
					}
				);
			});
		});
	}

	static async insertCode(email: string, code: string): Promise<boolean> {
		const query =
			"INSERT INTO confirmations (email, confirmation_code) VALUES (?, ?)";

		return connectToDatabase().then((connection) => {
			return new Promise((resolve, reject) => {
				connection.query(
					query,
					[email, code],
					(err: QueryError | null, result: ResultSetHeader) => {
						if (err) {
							const error: DatabaseError = new Error(err.message);
							error.code = 500;
							reject(error);

							return;
						}
						if (result.insertId) {
							resolve(true);
						}
					}
				);
			});
		});
	}
}
