"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
const objection_1 = require("objection");
const initDB = (config) => {
    const knexInstance = knex_1.knex({
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
