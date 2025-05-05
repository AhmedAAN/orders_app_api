import { Connection } from "mysql2/typings/mysql/lib/Connection";

const tableDefinitions = {
	Users: `
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE ,
	password_hash VARCHAR(255) ,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
	`,
	Confirmations: `
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
	confirmation_code VARCHAR(4) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
	`,
};

const initiateTables = async (connection: Connection) => {
	for (const [table_name, table_defenition] of Object.entries(
		tableDefinitions
	)) {
		const query = `CREATE TABLE IF NOT EXISTS ${table_name} (${table_defenition})`;
		connection.execute(query, (err) => {
			if (err) console.error(err);
		});
	}
};

export default initiateTables;
