import {knex} from "knex"

import {Model} from "objection"



const initDB = config => {
  // Use a Postgres DB in production.
  const DBConfig = process.env.NODE_ENV === 'production' ? {
    client: "postgresql",
    connection: {
      connectionString: config.databaseUrl,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    },
    migrations: {
      directory: config.databaseMigrationPath,
    },
  } : {
    client: "better-sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./" + config.dbPath,
    },
    migrations: {
      directory: config.databaseMigrationPath,
    },
  }
  

  const knexInstance = knex(DBConfig)

  Model.knex(knexInstance)

  return knexInstance
}

export default initDB
