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
const fcl = __importStar(require("@onflow/fcl"));
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const db_1 = __importDefault(require("./db"));
const block_cursor_1 = require("./services/block-cursor");
const flow_1 = require("./services/flow");
const kibbles_1 = require("./services/kibbles");
const kitty_items_1 = require("./services/kitty-items");
const market_1 = require("./services/market");
const sale_offer_handler_1 = require("./workers/sale-offer-handler");
const argv = yargs_1.default(helpers_1.hideBin(process.argv)).argv;
const LOCAL = argv.dev;
let envVars;
if (LOCAL) {
    const env = require("dotenv");
    const expandEnv = require("dotenv-expand");
    const config = env.config({
        path: ".env.local",
    });
    expandEnv(config);
    envVars = config.parsed;
}
async function run() {
    const config = config_1.getConfig(envVars);
    const db = db_1.default(config);
    // Make sure to disconnect from DB when exiting the process
    process.on("SIGTERM", () => {
        db.destroy().then(() => {
            process.exit(0);
        });
    });
    // Run all database migrations
    await db.migrate.latest();
    const flowService = new flow_1.FlowService(config.minterAddress, config.minterPrivateKeyHex, config.minterAccountKeyIndex);
    const marketService = new market_1.MarketService(flowService, config.fungibleTokenAddress, config.minterAddress, config.nonFungibleTokenAddress, config.minterAddress, config.minterAddress);
    // Make sure we're pointing to the correct Flow Access API.
    fcl.config().put("accessNode.api", config.accessApi);
    const startWorker = () => {
        console.log("Starting Flow event worker ....");
        const blockCursorService = new block_cursor_1.BlockCursorService();
        const saleOfferWorker = new sale_offer_handler_1.SaleOfferHandler(marketService, blockCursorService, flowService);
        saleOfferWorker.run();
    };
    const startAPIServer = () => {
        console.log("Starting API server ....");
        const kibblesService = new kibbles_1.KibblesService(flowService, config.fungibleTokenAddress, config.minterAddress);
        const kittyItemsService = new kitty_items_1.KittyItemsService(flowService, config.nonFungibleTokenAddress, config.minterAddress);
        const app = app_1.default(kibblesService, kittyItemsService, marketService);
        app.listen(config.port, () => {
            console.log(`Listening on port ${config.port}!`);
        });
    };
    if (LOCAL) {
        // If we're in dev, run everything in one process.
        startWorker();
        startAPIServer();
        return;
    }
    else if (argv.worker) {
        // If we're not in dev, look for flags. We do this so that
        // the worker can be started in seperate process using flag.
        // eg:
        // $> node /api/dist/index.js (starts API server)
        // $> node /api/dist/index.js --worker (starts worker)
        // Start the worker only if worker is passed as command flag.
        // See above notes for why.
        startWorker();
    }
    else {
        // Default when not in dev: start the API server.
        startAPIServer();
    }
}
const redOutput = "\x1b[31m%s\x1b[0m";
run().catch((e) => {
    console.error(redOutput, e);
    process.exit(1);
});
