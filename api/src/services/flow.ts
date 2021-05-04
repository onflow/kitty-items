import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";

import { ec as EC } from "elliptic";

import { SHA3 } from "sha3";

const ec: EC = new EC("p256");

class FlowService {
  constructor(
    private readonly minterFlowAddress: string,
    private readonly minterPrivateKeyHex: string,
    private readonly minterAccountIndex: string | number
  ) {}

  authorizeMinter = () => {
    return async (account: any = {}) => {
      const user = await this.getAccount(this.minterFlowAddress);
      const key = user.keys[this.minterAccountIndex];
      let sequenceNum;
      if (account.role.proposer) {
        sequenceNum = key.sequenceNumber;
      }
      const signingFunction = async (data) => {
        return {
          addr: user.address,
          keyId: key.index,
          signature: this.signWithKey(this.minterPrivateKeyHex, data.message),
        };
      };
      return {
        ...account,
        addr: user.address,
        keyId: key.index,
        sequenceNum,
        signature: account.signature || null,
        signingFunction,
        resolve: null,
        roles: account.roles,
      };
    };
  };

  getAccount = async (addr: string) => {
    const { account } = await fcl.send([fcl.getAccount(addr)]);
    return account;
  };

  private signWithKey = (privateKey: string, msg: string) => {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const sig = key.sign(this.hashMsg(msg));
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    return Buffer.concat([r, s]).toString("hex");
  };

  private hashMsg = (msg: string) => {
    const sha = new SHA3(256);
    sha.update(Buffer.from(msg, "hex"));
    return sha.digest();
  };

  sendTx = async ({
    transaction,
    args,
    proposer,
    authorizations,
    payer,
  }): Promise<any> => {
    const response = await fcl.send([
      fcl.transaction`
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

  async executeScript<T>({ script, args }): Promise<T> {
    const response = await fcl.send([fcl.script`${script}`, fcl.args(args)]);
    return await fcl.decode(response);
  }

  async getLatestBlockHeight() {
    const block = await sdk.send(await sdk.build([sdk.getBlock(true)]));
    const decoded = await sdk.decode(block);
    return decoded.height;
  }
}

export { FlowService };
