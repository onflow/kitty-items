import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("block_cursor", async (table) => {
    table.renameColumn("flow_event_name", "event_name");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("block_cursor", async (table) => {
    table.renameColumn("event_name", "flow_event_name");
  });
}
