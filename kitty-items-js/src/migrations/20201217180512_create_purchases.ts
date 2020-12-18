import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("purchases", async (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.text("buyer_address");
    table.text("tx_hash");
    table.uuid("sale_offer_id").references("id").inTable("sale_offers");
    table.integer("kitty_item_id").references("id").inTable("kitty_items");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("purchases");
}
