import dotenv from "dotenv";

let envLoaded = false;

export const getEnvConfig = () => {
	if (!envLoaded) {
		dotenv.config();
		envLoaded = true;
	}

	const APP_NAME = process.env.APP_NAME ?? "";
	const APP_ENV = process.env.APP_ENV ?? "";
	const APP_PORT = parseInt(process.env.APP_PORT ?? "");
	const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/secret-echo";

	const config = {
		APP_NAME,
		APP_ENV,
		APP_PORT,
		MONGO_URI,
	};

	return config;
};
