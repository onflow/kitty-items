module.exports = {
  client: "postgresql",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./src/migrations",
  },
};
