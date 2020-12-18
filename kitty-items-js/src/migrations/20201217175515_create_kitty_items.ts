import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("kitty_items", async (table) => {
    table.integer("id").primary();
    table.integer("type_id");
    table.text("owner_adress");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("kitty_items");
}
