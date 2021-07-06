"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable("sale_offers", async (table) => {
        table.integer("sale_item_id").primary();
        table.integer("sale_item_type").notNullable();
        table.text("sale_item_owner");
        table.decimal("sale_price");
        table.text("transaction_id");
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable("sale_offers");
}
exports.down = down;
