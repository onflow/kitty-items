// Dummy Knexfile - this is used so we can create new Knex migrations.
module.exports = {
  client: "postgresql",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./src/migrations",
  },
};
