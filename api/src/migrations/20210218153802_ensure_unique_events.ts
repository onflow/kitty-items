import * as Knex from "knex";

// Migration to ensure we don't get duplicate events in the DB
// Also changes the column to 'jsonb' so we can query the information
// in the event JSON that is stored.

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `create unique INDEX unique_event on sale_offer_events (
          (event->>'type'), 
          (event->>'transactionId'), 
          (event->>'eventIndex'),
          (event->>'transactionIndex')
        )`
  );
  return knex.schema.alterTable("sale_offer_events", function (table) {
    table.jsonb("event").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {}
