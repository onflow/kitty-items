import * as dotenv from "dotenv";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./services/flow";
import { DeployerService } from "./services/deployer";

async function run() {
  dotenv.config();
  fcl.config().put("accessNode.api", process.env.FLOW_NODE);
  const flowService = new FlowService(
    process.env.ACCOUNT_ADDRESS!,
    process.env.ACCOUNT_KEY_IDX!,
    process.env.ACCOUNT_PRIVATE_KEY!
  );
  const deployerService = new DeployerService(
    flowService,
    process.env.FUNGIBLE_TOKEN_ADDRESS!,
    process.env.NON_FUNGIBLE_TOKEN_ADDRESS!,
    process.env.ACCOUNT_ADDRESS!,
    process.env.ACCOUNT_KEY_IDX!,
    process.env.ACCOUNT_PRIVATE_KEY!
  );
  console.log(
    "starting deployment of contracts, accessNode:",
    process.env.FLOW_NODE,
    " address:",
    process.env.ACCOUNT_ADDRESS
  );
  const result = await deployerService.deploy();
  console.log("result", result);
  console.log(
    `https://flow-view-source.com/testnet/account/0x${process.env.ACCOUNT_ADDRESS}`
  );
  process.exit();
}

run().catch((e) => {
  console.error("error", e, e.stack);
  process.exit(1);
});
