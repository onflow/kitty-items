import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("sale_offer_events", function (table) {
    table.json("event").unique().alter();
  });
}

export async function down(knex: Knex): Promise<void> {}
