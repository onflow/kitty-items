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
exports.FlowService = void 0;
const fcl = __importStar(require("@onflow/fcl"));
const elliptic_1 = require("elliptic");
const sha3_1 = require("sha3");
const ec = new elliptic_1.ec("p256");
class FlowService {
    constructor(minterFlowAddress, minterPrivateKeyHex, minterAccountIndex) {
        this.minterFlowAddress = minterFlowAddress;
        this.minterPrivateKeyHex = minterPrivateKeyHex;
        this.minterAccountIndex = minterAccountIndex;
        this.authorizeMinter = () => {
            return async (account = {}) => {
                const user = await this.getAccount(this.minterFlowAddress);
                const key = user.keys[this.minterAccountIndex];
                const sign = this.signWithKey;
                const pk = this.minterPrivateKeyHex;
                return {
                    ...account,
                    tempId: `${user.address}-${key.index}`,
                    addr: fcl.sansPrefix(user.address),
                    keyId: Number(key.index),
                    signingFunction: (signable) => {
                        return {
                            addr: fcl.withPrefix(user.address),
                            keyId: Number(key.index),
                            signature: sign(pk, signable.message),
                        };
                    },
                };
            };
        };
        this.getAccount = async (addr) => {
            const { account } = await fcl.send([fcl.getAccount(addr)]);
            return account;
        };
        this.signWithKey = (privateKey, msg) => {
            const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
            const sig = key.sign(this.hashMsg(msg));
            const n = 32;
            const r = sig.r.toArrayLike(Buffer, "be", n);
            const s = sig.s.toArrayLike(Buffer, "be", n);
            return Buffer.concat([r, s]).toString("hex");
        };
        this.hashMsg = (msg) => {
            const sha = new sha3_1.SHA3(256);
            sha.update(Buffer.from(msg, "hex"));
            return sha.digest();
        };
        this.sendTx = async ({ transaction, args, proposer, authorizations, payer, }) => {
            const response = await fcl.send([
                fcl.transaction `
        ${transaction}
      `,
                fcl.args(args),
                fcl.proposer(proposer),
                fcl.authorizations(authorizations),
                fcl.payer(payer),
                fcl.limit(9999),
            ]);
            return await fcl.tx(response).onceSealed();
        };
    }
    async executeScript({ script, args }) {
        const response = await fcl.send([fcl.script `${script}`, fcl.args(args)]);
        return await fcl.decode(response);
    }
    async getLatestBlockHeight() {
        const block = await fcl.send([fcl.getBlock(true)]);
        const decoded = await fcl.decode(block);
        return decoded.height;
    }
}
exports.FlowService = FlowService;
