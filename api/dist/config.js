"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var flowAccountErrorMessaage = "\n\nNo Flow account configured.\n\nDid you export FLOW_ADDRESS and FLOW_PRIVATE_KEY?\n\n";
var defaultPort = 3000;
var defaultMigrationPath = "./src/migrations";
function getConfig(env) {
    var port = env.PORT || defaultPort;
    var accessApi = env.FLOW_ACCESS_API;
    var minterAddress = env.MINTER_ADDRESS;
    var minterPrivateKeyHex = env.MINTER_PRIVATE_KEY;
    if (!env.MINTER_ADDRESS || !env.MINTER_PRIVATE_KEY) {
        throw flowAccountErrorMessaage;
    }
    var minterAccountKeyIndex = env.MINTER_ACCOUNT_KEY_INDEX || 0;
    var fungibleTokenAddress = env.FUNGIBLE_TOKEN_ADDRESS;
    var nonFungibleTokenAddress = env.NON_FUNGIBLE_TOKEN_ADDRESS;
    var databaseUrl = env.DATABASE_URL;
    var databaseMigrationPath = process.env.MIGRATION_PATH || defaultMigrationPath;
    return {
        port: port,
        accessApi: accessApi,
        minterAddress: minterAddress,
        minterPrivateKeyHex: minterPrivateKeyHex,
        minterAccountKeyIndex: minterAccountKeyIndex,
        fungibleTokenAddress: fungibleTokenAddress,
        nonFungibleTokenAddress: nonFungibleTokenAddress,
        databaseUrl: databaseUrl,
        databaseMigrationPath: databaseMigrationPath,
    };
}
exports.getConfig = getConfig;
