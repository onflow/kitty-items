"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.alterTable("block_cursor", async (table) => {
        table.renameColumn("flow_event_name", "event_name");
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.alterTable("block_cursor", async (table) => {
        table.renameColumn("event_name", "flow_event_name");
    });
}
exports.down = down;
