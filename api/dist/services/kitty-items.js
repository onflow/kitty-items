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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KittyItemsService = void 0;
const t = __importStar(require("@onflow/types"));
const fcl = __importStar(require("@onflow/fcl"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"';
const kittyItemsPath = '"../../contracts/KittyItems.cdc"';
class KittyItemsService {
    constructor(flowService, nonFungibleTokenAddress, kittyItemsAddress) {
        this.flowService = flowService;
        this.nonFungibleTokenAddress = nonFungibleTokenAddress;
        this.kittyItemsAddress = kittyItemsAddress;
        this.setupAccount = async () => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItems/setup_account.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.sendTx({
                transaction,
                args: [],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.mint = async (recipient, typeID) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItems/mint_kitty_item.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.sendTx({
                transaction,
                args: [fcl.arg(recipient, t.Address), fcl.arg(typeID, t.UInt64)],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.transfer = async (recipient, itemID) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItems/transfer_kitty_item.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.sendTx({
                transaction,
                args: [fcl.arg(recipient, t.Address), fcl.arg(itemID, t.UInt64)],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.getCollectionIds = async (account) => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/scripts/kittyItems/get_collection_ids.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(account, t.Address)],
            });
        };
        this.getKittyItemType = async (itemID) => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/scripts/kittyItems/get_kitty_item_type_id.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(itemID, t.UInt64)],
            });
        };
        this.getSupply = async () => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/scripts/kittyItems/get_kitty_items_supply.cdc`), "utf8")
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.executeScript({ script, args: [] });
        };
    }
}
exports.KittyItemsService = KittyItemsService;
