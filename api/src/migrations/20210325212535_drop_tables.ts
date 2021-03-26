import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE sale_offers DROP CONSTRAINT sale_offers_pkey CASCADE`
  );
  await knex.raw(
    `ALTER TABLE kitty_items DROP CONSTRAINT kitty_items_pkey CASCADE`
  );
  await knex.schema.dropTable("block_cursor");
  await knex.schema.dropTable("kitty_items");
  return knex.schema.dropTable("sale_offers");
}

export async function down(knex: Knex): Promise<void> {}
