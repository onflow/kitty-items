"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validate_request_1 = require("../middlewares/validate-request");
function initKittyItemsRouter(kittyItemsService) {
    const router = express_1.default.Router();
    router.post("/kitty-items/mint", [express_validator_1.body("recipient").exists(), express_validator_1.body("typeID").isInt()], validate_request_1.validateRequest, async (req, res) => {
        const { recipient, typeID } = req.body;
        const tx = await kittyItemsService.mint(recipient, typeID);
        return res.send({
            transaction: tx,
        });
    });
    router.post("/kitty-items/setup", async (req, res) => {
        const transaction = await kittyItemsService.setupAccount();
        return res.send({
            transaction,
        });
    });
    router.post("/kitty-items/transfer", [express_validator_1.body("recipient").exists(), express_validator_1.body("itemID").isInt()], validate_request_1.validateRequest, async (req, res) => {
        const { recipient, itemID } = req.body;
        const tx = await kittyItemsService.transfer(recipient, itemID);
        return res.send({
            transaction: tx,
        });
    });
    router.get("/kitty-items/collection/:account", async (req, res) => {
        const collection = await kittyItemsService.getCollectionIds(req.params.account);
        return res.send({
            collection,
        });
    });
    router.get("/kitty-items/item/:itemID", async (req, res) => {
        const item = await kittyItemsService.getKittyItemType(parseInt(req.params.itemID));
        return res.send({
            item,
        });
    });
    router.get("/kitty-items/supply", async (req, res) => {
        const supply = await kittyItemsService.getSupply();
        return res.send({
            supply,
        });
    });
    return router;
}
exports.default = initKittyItemsRouter;
