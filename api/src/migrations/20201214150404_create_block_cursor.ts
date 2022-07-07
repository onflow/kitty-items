import {Knex} from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("block_cursor", async table => {
    table.uuid("id").primary()
    table.bigInteger("current_block_height")
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("block_cursor")
}
