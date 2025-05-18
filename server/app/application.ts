import bodyParser from "body-parser";
import express from "express";
import http from "http";
import WebSocket from "ws";
import { getEnvConfig } from "../config/config";

import oplog from "../oplog/oplog";
import { mapUrls } from "./url_mapping";


export function bootstrapApp() {
	const app = express();
	const server = http.createServer(app);
	const wss = new WebSocket.Server({ server });

	// Use Railway's PORT environment variable with fallback to config
	const PORT = process.env.PORT || getEnvConfig().APP_PORT || 3000;

	// Register Express middlewares and routes
	registerMiddlewares(app);
	mapUrls(app);
	

	// Add error handling for the WebSocket server
	wss.on("error", (error) => {
		oplog.error("WebSocket server error:", error);
	});

	// Start the server, binding to 0.0.0.0 for external accessibility
	server.listen(PORT, () => {
		oplog.info(`Server is running on port ${PORT}`);
	});
}

function registerMiddlewares(app: express.Express) {
	app.use(bodyParser.json({ limit: "50mb" }));
	app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
	
}
