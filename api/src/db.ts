import {knex} from "knex"

import {Model} from "objection"

const initDB = config => {
  const knexInstance = knex({
    client: "better-sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./" + config.dbPath,
    },
    migrations: {
      directory: config.databaseMigrationPath,
    },
  })

  Model.knex(knexInstance)

  return knexInstance
}

export default initDB
