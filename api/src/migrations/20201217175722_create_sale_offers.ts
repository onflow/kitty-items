import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sale_offers", async (table) => {
    table.integer("sale_item_id").primary();
    table.integer("sale_item_type").notNullable();
    table.text("sale_item_owner");
    table.decimal("sale_price");
    table.text("transaction_id");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sale_offers");
}
