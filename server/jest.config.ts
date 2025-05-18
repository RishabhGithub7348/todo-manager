import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/__tests__"],
	testMatch: ["**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json", "node"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
	moduleDirectories: ["node_modules", "src"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	verbose: true,
};

export default config;
