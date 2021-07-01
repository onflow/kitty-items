"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var knex_1 = require("knex");
var objection_1 = require("objection");
var initDB = function (config) {
    var knexInstance = knex_1.knex({
        client: "postgresql",
        connection: {
            connectionString: config.databaseUrl,
            ssl: process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
        },
        migrations: {
            directory: config.databaseMigrationPath,
        },
    });
    objection_1.Model.knex(knexInstance);
    return knexInstance;
};
exports.default = initDB;
