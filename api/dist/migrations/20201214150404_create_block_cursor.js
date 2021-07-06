"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.raw('create extension if not exists "uuid-ossp"');
    await knex.schema.createTable("block_cursor", async (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.text("flow_event_name").unique().notNullable();
        table.bigInteger("current_block_height");
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable("block_cursor");
    await knex.raw('drop extension if exists "uuid-ossp"');
}
exports.down = down;
