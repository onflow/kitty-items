import {knex} from "knex"

import {Model} from "objection"

const initDB = config => {
  const knexInstance = knex({
    client: "sqlite3",
    connection: {
      filename: config.dbPath,
    },
    migrations: {
      directory: config.databaseMigrationPath,
    },
  })

  Model.knex(knexInstance)

  return knexInstance
}

export default initDB
