import initApp from "./app";
import { KibblesService } from "./services/kibbles";
import { FlowService } from "./services/flow";
import * as fcl from "@onflow/fcl";

async function run() {
  fcl.config().put("accessNode.api", process.env.FLOW_NODE);
  const flowService = new FlowService(
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.MINTER_PRIVATE_KEY!,
    process.env.MINTER_ACCOUNT_KEY_IDX!
  );
  const kibblesService = new KibblesService(flowService);

  const app = initApp(kibblesService);

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

run().catch((e) => {
  console.error("error", e);
  process.exit(1);
});
