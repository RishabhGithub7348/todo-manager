import { bootstrapApp } from "./app/application";
import { DBConnection } from "./db/db_connection";
import oplog from "./oplog/oplog";

(async () => {
	try {
		// connect to db or use existing connection
		await DBConnection.getInstance().connect();
		

		// setup the app
		bootstrapApp();
	} catch (error) {
		oplog.error("failed to start the application: ", error);
	}
})();
