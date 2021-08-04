module.exports = {
    testEnvironment: "node",
    verbose: true,
    coveragePathIgnorePatterns: ["/node_modules/"],
    "setupFiles": [
        "<rootDir>/test/setup.js"
    ],
		testMatch: ["**/**/kibble.test.js"]
};
