import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sale_offers", async (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.integer("sale_item_id").unique().notNullable();
    table.integer("sale_item_type").notNullable();
    table.text("sale_item_collection");
    table.decimal("price");
    table.text("transaction_id");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sale_offers");
}
