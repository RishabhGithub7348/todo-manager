import mongoose from "mongoose";
import { getEnvConfig } from "../config/config";
import oplog from "../oplog/oplog";

export class DBConnection {
	private static instance: DBConnection;

	private constructor() {}

	static getInstance(): DBConnection {
		if (!DBConnection.instance) {
			DBConnection.instance = new DBConnection();
		}
		return DBConnection.instance;
	}

	async connect() {
		try {
			const envConfig = getEnvConfig();
			await mongoose.connect(envConfig.MONGO_URI);
			oplog.info("Successfully connected to MongoDB");
		} catch (error: any) {
			oplog.error(`Unable to connect to MongoDB: ${error.message}`);
			throw error;
		}
	}
}
