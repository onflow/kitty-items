module.exports = {
	testEnvironment: "node",
	verbose: true,
	coveragePathIgnorePatterns: ["/node_modules/"],
	setupFiles: ["<rootDir>/test/setup.js"],
	projects: [
		{
			displayName: "Cadence Tests",
			testMatch: ["<rootDir>/test/*.test.js"],
			runner: "@codejedi365/jest-serial-runner",
		},
	],
};
