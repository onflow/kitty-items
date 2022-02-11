require("dotenv").config({
  path: ".env.dev"
});

module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./api",
      script: "npm",
      args: "run dev"
    },
    {
      name: "web",
      cwd: "./web",
      script: "npm",
      args: "run dev"
    }
  ]
};
