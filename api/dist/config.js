"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var fcl = __importStar(require("@onflow/fcl"));
var dotenv = __importStar(require("dotenv"));
var dotenv_expand_1 = __importDefault(require("dotenv-expand"));
var flowAccountErrorMessaage = "\n\nNo Flow account configured.\n\nDid you export FLOW_ADDRESS and FLOW_PRIVATE_KEY?\n\n";
var defaultPort = 3000;
var defaultMigrationPath = "./src/migrations";
var productionEnv = "production";
var productionDotEnv = ".env";
var localDotEnv = ".env.local";
function getConfig() {
    var env = dotenv.config({
        path: process.env.NODE_ENV === productionEnv ? productionDotEnv : localDotEnv,
    });
    dotenv_expand_1.default(env);
    var port = process.env.PORT || defaultPort;
    var accessApi = process.env.FLOW_ACCESS_API;
    var minterAddress = fcl.withPrefix(process.env.MINTER_ADDRESS);
    var minterPrivateKeyHex = process.env.MINTER_PRIVATE_KEY;
    if (!process.env.MINTER_ADDRESS || !process.env.MINTER_PRIVATE_KEY) {
        throw flowAccountErrorMessaage;
    }
    var minterAccountKeyIndex = process.env.MINTER_ACCOUNT_KEY_INDEX || 0;
    var fungibleTokenAddress = fcl.withPrefix(process.env.FUNGIBLE_TOKEN_ADDRESS);
    var nonFungibleTokenAddress = fcl.withPrefix(process.env.NON_FUNGIBLE_TOKEN_ADDRESS);
    var databaseUrl = process.env.DATABASE_URL;
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
