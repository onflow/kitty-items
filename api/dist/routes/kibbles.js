"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validate_request_1 = require("../middlewares/validate-request");
function initKibblesRouter(kibblesService) {
    const router = express_1.default.Router();
    router.post("/kibbles/mint", [express_validator_1.body("recipient").exists(), express_validator_1.body("amount").isDecimal()], validate_request_1.validateRequest, async (req, res) => {
        const { recipient, amount } = req.body;
        const transaction = await kibblesService.mint(recipient, amount);
        return res.send({
            transaction,
        });
    });
    router.post("/kibbles/setup", async (req, res) => {
        const transaction = await kibblesService.setupAccount();
        return res.send({
            transaction,
        });
    });
    router.post("/kibbles/burn", [
        express_validator_1.body("amount").isInt({
            gt: 0,
        }),
    ], validate_request_1.validateRequest, async (req, res) => {
        const { amount } = req.body;
        const transaction = await kibblesService.burn(amount);
        return res.send({
            transaction,
        });
    });
    router.post("/kibbles/transfer", [
        express_validator_1.body("recipient").exists(),
        express_validator_1.body("amount").isInt({
            gt: 0,
        }),
    ], validate_request_1.validateRequest, async (req, res) => {
        const { recipient, amount } = req.body;
        const transaction = await kibblesService.transfer(recipient, amount);
        return res.send({
            transaction,
        });
    });
    router.get("/kibbles/balance/:account", async (req, res) => {
        const balance = await kibblesService.getBalance(req.params.account);
        return res.send({
            balance,
        });
    });
    router.get("/kibbles/supply", async (req, res) => {
        const supply = await kibblesService.getSupply();
        return res.send({
            supply,
        });
    });
    return router;
}
exports.default = initKibblesRouter;
