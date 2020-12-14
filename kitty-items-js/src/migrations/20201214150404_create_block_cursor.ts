import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("block_cursor", async (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
    table.text("flow_event_name").unique().notNullable();
    table.bigInteger("current_block_height");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("block_cursor");
}
