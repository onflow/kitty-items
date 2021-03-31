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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fcl = __importStar(require("@onflow/fcl"));
var knex_1 = __importDefault(require("knex"));
var yargs_1 = __importDefault(require("yargs/yargs"));
var helpers_1 = require("yargs/helpers");
var app_1 = __importDefault(require("./app"));
var config_1 = require("./config");
var block_cursor_1 = require("./services/block-cursor");
var flow_1 = require("./services/flow");
var kibbles_1 = require("./services/kibbles");
var kitty_items_1 = require("./services/kitty-items");
var market_1 = require("./services/market");
var sale_offer_handler_1 = require("./workers/sale-offer-handler");
var knexInstance;
var argv = yargs_1.default(helpers_1.hideBin(process.argv)).argv;
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var config, flowService, marketService, blockCursorService, saleOfferWorker, kibblesService, kittyItemsService, app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = config_1.getConfig();
                    knexInstance = knex_1.default({
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
                    // Make sure to disconnect from DB when exiting the process
                    process.on("SIGTERM", function () {
                        knexInstance.destroy().then(function () {
                            process.exit(0);
                        });
                    });
                    // Run all database migrations
                    return [4 /*yield*/, knexInstance.migrate.latest()];
                case 1:
                    // Run all database migrations
                    _a.sent();
                    flowService = new flow_1.FlowService(config.minterAddress, config.minterPrivateKeyHex, config.minterAccountKeyIndex);
                    marketService = new market_1.MarketService(flowService, config.fungibleTokenAddress, config.minterAddress, config.nonFungibleTokenAddress, config.minterAddress, config.minterAddress);
                    if (argv.worker) {
                        blockCursorService = new block_cursor_1.BlockCursorService();
                        saleOfferWorker = new sale_offer_handler_1.SaleOfferHandler(marketService, blockCursorService, flowService);
                        saleOfferWorker.run();
                    }
                    else {
                        // Make sure we're pointing to the correct Flow Access API.
                        fcl.config().put("accessNode.api", config.accessApi);
                        kibblesService = new kibbles_1.KibblesService(flowService, config.fungibleTokenAddress, config.minterAddress);
                        kittyItemsService = new kitty_items_1.KittyItemsService(flowService, config.nonFungibleTokenAddress, config.minterAddress);
                        app = app_1.default(knexInstance, kibblesService, kittyItemsService, marketService);
                        app.listen(config.port, function () {
                            console.log("Listening on port " + config.port + "!");
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var redOutput = "\x1b[31m%s\x1b[0m";
run().catch(function (e) {
    console.error(redOutput, e);
    process.exit(1);
});
