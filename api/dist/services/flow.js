"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowService = void 0;
var fcl = __importStar(require("@onflow/fcl"));
var sdk = __importStar(require("@onflow/sdk"));
var elliptic_1 = require("elliptic");
var sha3_1 = require("sha3");
var ec = new elliptic_1.ec("p256");
var FlowService = /** @class */ (function () {
    function FlowService(minterFlowAddress, minterPrivateKeyHex, minterAccountIndex) {
        var _this = this;
        this.minterFlowAddress = minterFlowAddress;
        this.minterPrivateKeyHex = minterPrivateKeyHex;
        this.minterAccountIndex = minterAccountIndex;
        this.authorizeMinter = function () {
            return function (account) {
                if (account === void 0) { account = {}; }
                return __awaiter(_this, void 0, void 0, function () {
                    var user, key, sequenceNum, signingFunction;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.getAccount(this.minterFlowAddress)];
                            case 1:
                                user = _a.sent();
                                key = user.keys[this.minterAccountIndex];
                                if (account.role.proposer) {
                                    sequenceNum = key.sequenceNumber;
                                }
                                signingFunction = function (data) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, {
                                                addr: user.address,
                                                keyId: key.index,
                                                signature: this.signWithKey(this.minterPrivateKeyHex, data.message),
                                            }];
                                    });
                                }); };
                                return [2 /*return*/, __assign(__assign({}, account), { addr: user.address, keyId: key.index, sequenceNum: sequenceNum, signature: account.signature || null, signingFunction: signingFunction, resolve: null, roles: account.roles })];
                        }
                    });
                });
            };
        };
        this.getAccount = function (addr) { return __awaiter(_this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fcl.send([fcl.getAccount(addr)])];
                    case 1:
                        account = (_a.sent()).account;
                        return [2 /*return*/, account];
                }
            });
        }); };
        this.signWithKey = function (privateKey, msg) {
            var key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
            var sig = key.sign(_this.hashMsg(msg));
            var n = 32;
            var r = sig.r.toArrayLike(Buffer, "be", n);
            var s = sig.s.toArrayLike(Buffer, "be", n);
            return Buffer.concat([r, s]).toString("hex");
        };
        this.hashMsg = function (msg) {
            var sha = new sha3_1.SHA3(256);
            sha.update(Buffer.from(msg, "hex"));
            return sha.digest();
        };
        this.sendTx = function (_a) {
            var transaction = _a.transaction, args = _a.args, proposer = _a.proposer, authorizations = _a.authorizations, payer = _a.payer;
            return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, fcl.send([
                                fcl.transaction(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        ", "\n      "], ["\n        ", "\n      "])), transaction),
                                fcl.args(args),
                                fcl.proposer(proposer),
                                fcl.authorizations(authorizations),
                                fcl.payer(payer),
                                fcl.limit(9999),
                            ])];
                        case 1:
                            response = _b.sent();
                            return [4 /*yield*/, fcl.tx(response).onceSealed()];
                        case 2: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        };
    }
    FlowService.prototype.executeScript = function (_a) {
        var script = _a.script, args = _a.args;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fcl.send([fcl.script(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", ""], ["", ""])), script), fcl.args(args)])];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, fcl.decode(response)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    FlowService.prototype.getLatestBlockHeight = function () {
        return __awaiter(this, void 0, void 0, function () {
            var block, decoded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.send(sdk.build([sdk.getBlock(true)]))];
                    case 1:
                        block = _a.sent();
                        return [4 /*yield*/, sdk.decode(block)];
                    case 2:
                        decoded = _a.sent();
                        return [2 /*return*/, decoded.height];
                }
            });
        });
    };
    return FlowService;
}());
exports.FlowService = FlowService;
var templateObject_1, templateObject_2;
