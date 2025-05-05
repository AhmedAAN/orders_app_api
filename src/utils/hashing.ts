import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
	const saltRounds = 10;
	return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	return bcrypt.compare(password, hashedPassword).then((valid) => {
		if (valid) {
			return true;
		} else {
			const error = new Error("Password is incorrect!");
			(error as any).password = true;
			(error as any).code = 401;
			throw error;
		}
	});
};
