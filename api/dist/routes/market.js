"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validate_request_1 = require("../middlewares/validate-request");
function initMarketRouter(marketService) {
    const router = express_1.default.Router();
    router.post("/market/buy", [express_validator_1.body("account").exists(), express_validator_1.body("itemID").isInt()], validate_request_1.validateRequest, async (req, res) => {
        const { account, itemID } = req.body;
        const tx = await marketService.buy(account, itemID);
        return res.send({
            transactionId: tx,
        });
    });
    router.post("/market/setup", async (req, res) => {
        const tx = await marketService.setupAccount();
        return res.send({
            transactionId: tx,
        });
    });
    router.post("/market/sell", [express_validator_1.body("itemID").isInt(), express_validator_1.body("price").isDecimal()], validate_request_1.validateRequest, async (req, res) => {
        const { itemID, price } = req.body;
        const tx = await marketService.sell(itemID, price);
        return res.send({
            transactionId: tx,
        });
    });
    router.get("/market/collection/:account", async (req, res) => {
        const items = await marketService.getItems(req.params.account);
        return res.send({
            items,
        });
    });
    router.get("/market/collection/:account/:item", async (req, res) => {
        const item = await marketService.getItem(req.params.account, parseInt(req.params.item));
        return res.send({
            item,
        });
    });
    router.get("/market/latest", async (req, res) => {
        const latestSaleOffers = await marketService.findMostRecentSales();
        return res.send({
            latestSaleOffers,
        });
    });
    return router;
}
exports.default = initMarketRouter;
