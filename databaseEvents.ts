import { Connection } from "mysql2/typings/mysql/lib/Connection";

export const initiateEvents = async (connection: Connection) => {
	const query = `
        CREATE EVENT IF NOT EXISTS delete_expired_codes
        ON SCHEDULE EVERY 1 MINUTE
        DO
            DELETE FROM confirmations
            WHERE created_at < NOW() - INTERVAL 15 MINUTE;
    `;
	connection.execute(query, (err) => {
		if (err) console.error(err);
	});
};

export const setGlobalVar = async (connection: Connection) => {
	const query = "SET GLOBAL event_scheduler = ON;";
	connection.execute(query, (err) => {
		if (err) console.error(err);
	});
};
