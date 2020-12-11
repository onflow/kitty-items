import * as dotenv from "dotenv";
import * as fcl from "@onflow/fcl";
import initApp from "./app";
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
    process.env.FUNGIBLE_TOKEN_ADDRESS!
  );
  const app = initApp(deployerService);

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

run().catch((e) => {
  console.error("error", e);
  process.exit(1);
});