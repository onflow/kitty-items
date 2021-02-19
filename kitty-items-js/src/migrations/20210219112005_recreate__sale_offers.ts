import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sale_offers", async (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.integer("itemid").unique().notNullable();
    table.integer("itemtype").notNullable();
    table.text("seller_address");
    table.decimal("price");
    table.text("tx_hash");
    table.integer("offer_blockheight").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
