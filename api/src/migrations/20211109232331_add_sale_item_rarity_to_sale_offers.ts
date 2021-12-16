import {Knex} from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sale_offers", async table => {
    table.integer("sale_item_rarity")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sale_offers", async table => {
    table.dropColumn("sale_item_rarity")
  })
}
