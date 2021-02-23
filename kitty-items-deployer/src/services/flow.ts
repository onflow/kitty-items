import * as fcl from "@onflow/fcl";
import * as rlp from "@onflow/rlp";
import * as t from "@onflow/types";

import { ec as EC } from "elliptic";

import { SHA3 } from "sha3";

const ec: EC = new EC("p256");

class FlowService {
  constructor(
    private readonly accountAddress: string,
    private readonly accountIndex: string,
    private readonly accountPrivateKeyHex: string
  ) {}

  authorize = ({ accountAddress, keyIdx, privateKey }) => {
    return async (account: any = {}) => {
      const user = await this.getAccount(accountAddress);
      const key = user.keys[keyIdx];
      let sequenceNum;
      if (account.role.proposer) {
        sequenceNum = key.sequenceNumber;
      }
      const signingFunction = async (data) => {
        return {
          addr: user.address,
          keyId: key.index,
          signature: this.signWithKey(privateKey, data.message),
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

  authorizeAccount = () => {
    return this.authorize({
      accountAddress: this.accountAddress,
      keyIdx: this.accountIndex,
      privateKey: this.accountPrivateKeyHex,
    });
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

  genKeys = (): { publicKey: string; privateKey: string; flowKey: string } => {
    const keys = ec.genKeyPair();
    const privateKey = keys.getPrivate("hex");
    const publicKey = keys.getPublic("hex").replace(/^04/, "");
    return {
      publicKey,
      privateKey,
      flowKey: this.encodePublicKey(publicKey),
    };
  };

  private encodePublicKey = (publicKey: string): string => {
    return rlp
      .encode([Buffer.from(publicKey, "hex"), 2, 3, 1000])
      .toString("hex");
  };

  createFlowAccount = async (): Promise<any> => {
    const keys = this.genKeys();
    const authorization = this.authorizeAccount();
    const response = await fcl.send([
      fcl.transaction`
        transaction(publicKey: String) {
          let payer: AuthAccount
          prepare(payer: AuthAccount) {
            self.payer = payer
          }
          execute {
            let account = AuthAccount(payer: self.payer)
            account.addPublicKey(publicKey.decodeHex())
          }
        }
      `,
      fcl.args([fcl.arg(keys.flowKey, t.String)]),
      fcl.proposer(authorization),
      fcl.authorizations([authorization]),
      fcl.payer(authorization),
    ]);
    const { events } = await fcl.tx(response).onceSealed();
    const accountCreatedEvent = events.find(
      (d) => d.type === "flow.AccountCreated"
    );
    if (!accountCreatedEvent) throw new Error("No flow.AccountCreated found");
    let addr = accountCreatedEvent.data.address;
    // a standardized string format for addresses is coming soon
    // our aim is to make them as small as possible while making them unambiguous
    addr = addr.replace(/^0x/, "");
    if (!addr) throw new Error("An address is required");

    const account = await this.getAccount(addr);
    const key = account.keys.find((d) => d.publicKey === keys.publicKey);
    if (!key)
      throw new Error(
        "Could not find provided public key in on-chain flow account keys"
      );

    return {
      addr,
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      keyIdx: key.index,
    };
  };

  addContract = async ({
    name,
    code,
    proposer,
    authorizations,
    payer,
  }): Promise<any> => {
    console.log("add contract name:", name);
    const CODE = Buffer.from(code, "utf8").toString("hex");
    //deploy the code
    const response = await fcl.send([
      fcl.transaction`
        transaction(name: String, code: String) {
          let signer: AuthAccount
          prepare(signer: AuthAccount) {
            self.signer = signer
          }
          execute {
            self.signer.contracts.add(
              name: name,
              code: code.decodeHex()
            )
          }
        }
      `,
      fcl.args([fcl.arg(name, t.String), fcl.arg(CODE, t.String)]),
      fcl.proposer(proposer),
      fcl.authorizations(authorizations),
      fcl.payer(payer),
      fcl.limit(9999),
    ]);
    return await fcl.tx(response).onceSealed();
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
}

export { FlowService };
