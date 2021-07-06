"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable("kitty_items", async (table) => {
        table.integer("id").primary();
        table.integer("type_id");
        table.text("owner_address");
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    await knex.raw("ALTER TABLE kitty_items DROP CONSTRAINT kitty_items_pkey CASCADE");
    return knex.schema.dropTable("kitty_items");
}
exports.down = down;
