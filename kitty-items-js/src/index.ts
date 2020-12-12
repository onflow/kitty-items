import * as dotenv from "dotenv";
import * as fcl from "@onflow/fcl";
import initApp from "./app";
import { KibblesService } from "./services/kibbles";
import { FlowService } from "./services/flow";
import { KittyItemsService } from "./services/kittyItems";
import { MarketService } from "./services/market";

async function run() {
  dotenv.config();
  fcl.config().put("accessNode.api", process.env.FLOW_NODE);
  const flowService = new FlowService(
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.MINTER_PRIVATE_KEY!,
    process.env.MINTER_ACCOUNT_KEY_IDX!
  );
  const kibblesService = new KibblesService(flowService);
  const kittyItemsService = new KittyItemsService(
    flowService,
    process.env.NON_FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!,
  );
  const marketService = new MarketService(
    flowService,
    process.env.FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.NON_FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!
  )
  const app = initApp(kibblesService, kittyItemsService, marketService);

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

run().catch((e) => {
  console.error("error", e);
  process.exit(1);
});