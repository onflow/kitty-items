import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sale_offer_events", async (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.json("event");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
