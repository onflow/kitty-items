import { ec as EC } from 'elliptic';
import { SHA3 } from 'sha3';
import * as rlp from '@onflow/rlp';
import * as fcl from "@onflow/fcl";

const ec: EC = new EC('p256');

export const authorize = (addr, keyIdx, privateKey) => {
  return async (account:any = {}) => {
    const user = await getAccount(addr);
    const key = user.keys[keyIdx];
    let sequenceNum
    if (account.role.proposer) sequenceNum = key.sequenceNumber
    const signingFunction = async data => {
      return {
        addr: user.address,
        keyId: key.index,
        signature: signWithKey(privateKey, data.message),
      }
    }
    return {
      ...account,
      addr: user.address,
      keyId: key.index,
      sequenceNum,
      signature: account.signature || null,
      signingFunction,
      resolve: null,
      roles: account.roles,
    }
  }
}

const getAccount = async addr => {
  const {account} = await fcl.send([fcl.getAccount(addr)]);
  return account;
}

const signWithKey = (privateKey, msg) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'))
  const sig = key.sign(hashMsg(msg))
  const n = 32 // half of signature length?
  const r = sig.r.toArrayLike(Buffer, 'be', n)
  const s = sig.s.toArrayLike(Buffer, 'be', n)
  return Buffer.concat([r, s]).toString('hex')
}

const hashMsg = (msg: string) => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msg, 'hex'))
  return sha.digest()
}
