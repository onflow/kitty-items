"use strict";
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
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var validate_request_1 = require("../middlewares/validate-request");
function initMarketRouter(marketService) {
    var _this = this;
    var router = express_1.default.Router();
    router.post("/market/buy", [express_validator_1.body("account").exists(), express_validator_1.body("itemID").isInt()], validate_request_1.validateRequest, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, account, itemID, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, account = _a.account, itemID = _a.itemID;
                    return [4 /*yield*/, marketService.buy(account, itemID)];
                case 1:
                    tx = _b.sent();
                    return [2 /*return*/, res.send({
                            transactionId: tx,
                        })];
            }
        });
    }); });
    router.post("/market/setup", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, marketService.setupAccount()];
                case 1:
                    tx = _a.sent();
                    return [2 /*return*/, res.send({
                            transactionId: tx,
                        })];
            }
        });
    }); });
    router.post("/market/sell", [express_validator_1.body("itemID").isInt(), express_validator_1.body("price").isDecimal()], validate_request_1.validateRequest, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, itemID, price, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, itemID = _a.itemID, price = _a.price;
                    return [4 /*yield*/, marketService.sell(itemID, price)];
                case 1:
                    tx = _b.sent();
                    return [2 /*return*/, res.send({
                            transactionId: tx,
                        })];
            }
        });
    }); });
    router.get("/market/collection/:account", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, marketService.getItems(req.params.account)];
                case 1:
                    items = _a.sent();
                    return [2 /*return*/, res.send({
                            items: items,
                        })];
            }
        });
    }); });
    router.get("/market/collection/:account/:item", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, marketService.getItem(req.params.account, parseInt(req.params.item))];
                case 1:
                    item = _a.sent();
                    return [2 /*return*/, res.send({
                            item: item,
                        })];
            }
        });
    }); });
    router.get("/market/latest", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var latestSaleOffers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, marketService.findMostRecentSales()];
                case 1:
                    latestSaleOffers = _a.sent();
                    return [2 /*return*/, res.send({
                            latestSaleOffers: latestSaleOffers,
                        })];
            }
        });
    }); });
    return router;
}
exports.default = initMarketRouter;
