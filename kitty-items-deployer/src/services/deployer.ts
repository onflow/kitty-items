import { FlowService } from "./flow";
import * as fs from 'fs';
import * as path from 'path';

class DeployerService {

  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
  ) {}

  deploy = async () => {
    const account = await this.flowService.createFlowAccount();
    // build the authorization
    const authorization = this.flowService.authorize({ 
      accountAddress: account.addr,
      keyIdx: account.keyIdx,
      privateKey: account.privateKey
    });
    const payer = this.flowService.authorizeAccount();

    // Deploy Kibble
    let contract = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kibble/contracts/Kibble.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`);
    
    const kibble = await this.flowService.addContract({
      name: 'Kibble',
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer
    });

    // Deploy Non fungible token contract (to be removed)
    // Ask if the nft contract is considered a core contract

    contract = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItems/contracts/NonFungibleToken.cdc`), 'utf8');
      
    await this.flowService.addContract({
      name: 'NonFungibleToken',
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer
    });

    // Deploy Kitty items

    contract = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItems/contracts/KittyItems.cdc`), 'utf8')
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.addr}`);
    
    const kittyItems = await this.flowService.addContract({
      name: 'KittyItems',
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer
    });

    // Deploy kitty items market

    contract = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItemsMarket/contracts/kittyItemsMarket.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.addr}`)
      .replace(/0xKIBBLE/gi, `0x${account.addr}`)
      .replace(/0xKITTYITEMS/gi, `0x${account.addr}`);

    const kittyItemsMarket = await this.flowService.addContract({
      name: 'KittyItemsMarket',
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer
    });

    return { account, kibble, kittyItems, kittyItemsMarket };
  }
}

export { DeployerService };