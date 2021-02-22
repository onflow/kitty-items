import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";

class DeployerService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
    private readonly nonFungibleTokenAddress: string,
    private readonly contractFlowAddress: string,
    private readonly contractAccountIndex: string,
    private readonly contractPrivateKeyHex: string
  ) {}

  deploy = async () => {
    // build the authorization
    const authorization = this.flowService.authorize({
      accountAddress: this.contractFlowAddress,
      keyIdx: this.contractAccountIndex,
      privateKey: this.contractPrivateKeyHex,
    });
    const payer = this.flowService.authorizeAccount();

    // Deploy Kibble
    let contract = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/contracts/Kibble.cdc`
        ),
        "utf8"
      )
      .replace("./FungibleToken.cdc", `0x${this.fungibleTokenAddress}`);

    console.log("deploying...");

    console.log("deploying kibbles contract...");
    const kibble = await this.flowService.addContract({
      name: "Kibble",
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer,
    });
    console.log("deployed kibbles contract");

    // Deploy Kitty items

    contract = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/contracts/KittyItems.cdc`
        ),
        "utf8"
      )
      .replace("./NonFungibleToken.cdc", `0x${this.nonFungibleTokenAddress}`);

    console.log("deploying kitty items contract...");

    const kittyItems = await this.flowService.addContract({
      name: "KittyItems",
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer,
    });

    console.log("deployed kitty items contract");

    // Deploy kitty items market
    contract = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/contracts/KittyItemsMarket.cdc`
        ),
        "utf8"
      )
      .replace("./FungibleToken.cdc", `0x${this.fungibleTokenAddress}`)
      .replace("./NonFungibleToken.cdc", `0x${this.nonFungibleTokenAddress}`)
      .replace("./Kibble.cdc", `0x${this.contractFlowAddress}`)
      .replace("./KittyItems.cdc", `0x${this.contractFlowAddress}`);

    console.log("deploying kitty items marketplace...");
    const kittyItemsMarket = await this.flowService.addContract({
      name: "KittyItemsMarket",
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer,
    });
    console.log("deployed kitty items marketplace");

    return { kibble, kittyItems, kittyItemsMarket };
  };
}

export { DeployerService };
