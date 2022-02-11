function requireEnv(env) {
  switch (env) {
    case "emulator":
      return "env.local";
    case "testnet":
      return "env.testnet";
    default:
      throw new Error(
        `Unknown or missing CHAIN_ENV environment variable: ${env}`
      );
  }
}

require("dotenv").config({
  path: requireEnv(process.env.CHAIN_ENV)
});

module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./api",
      script: "npm",
      args: "run dev",
      watch: true,
      ignore_watch: ["node_modules"]
    },
    {
      name: "web",
      cwd: "./web",
      script: "npm",
      args: "run dev",
      watch: true,
      ignore_watch: ["node_modules"]
    },
    {
      name: "emulator",
      script: "flow",
      args: "emulator --dev-wallet"
    }
  ]
};
