import {knex} from "knex"

import {Model} from "objection"

const initDB = config => {
  const knexInstance = knex({
    client: "better-sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: config.dbPath || "./kitty-items-db.sqlite",
    },
    migrations: {
      directory: config.databaseMigrationPath,
    },
  })

  Model.knex(knexInstance)

  return knexInstance
}

export default initDB
