import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sale_offer_events");
}

export async function down(knex: Knex): Promise<void> {}
