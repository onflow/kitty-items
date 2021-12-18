import {Knex} from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("listings", async table => {
    table.integer("listing_rarity")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("listings", async table => {
    table.dropColumn("listing_rarity")
  })
}
