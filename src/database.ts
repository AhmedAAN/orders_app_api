import mysql from "mysql2";
import initiateTables from "./initializeTable";
import { setGlobalVar, initiateEvents } from "./databaseEvents";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

let connection: Connection;

const connectToDatabase = async () => {
	if (!connection) {
		connection = mysql.createConnection({
			host: "localhost",
			user: "nagy",
			password: "12345",
			database: "menuapp",
		});

		await initiateTables(connection);
		await setGlobalVar(connection);
		await initiateEvents(connection);
		connection.connect((err) => {
			if (err) {
				console.error("Error connecting to the database:", err);
				process.exit(1);
			} else {
				console.log("Connected to the database");
			}
		});
	}
	return connection;
};

connectToDatabase();

export default connectToDatabase;
