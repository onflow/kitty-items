import {Knex} from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("listings", async table => {
    table.integer("listing_id").primary()
    table.integer("listing_type").notNullable()
    table.text("listing_owner")
    table.decimal("sale_price")
    table.text("transaction_id")
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("listings")
}
