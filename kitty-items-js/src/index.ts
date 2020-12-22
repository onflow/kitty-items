import * as dotenv from "dotenv";
import * as fcl from "@onflow/fcl";
import initApp from "./app";
import Knex from "knex";
import { KibblesService } from "./services/kibbles";
import { FlowService } from "./services/flow";
import { KittyItemsService } from "./services/kitty-items";
import { MarketService } from "./services/market";

let knexInstance: Knex;

async function run() {
  dotenv.config();

  knexInstance = Knex({
    client: "postgresql",
    connection: process.env.DATABASE_URL!,
    migrations: {
      directory: "./src/migrations",
    },
  });

  await knexInstance.migrate.latest();

  fcl.config().put("accessNode.api", process.env.FLOW_NODE);
  const flowService = new FlowService(
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.MINTER_PRIVATE_KEY!,
    process.env.MINTER_ACCOUNT_KEY_IDX!
  );
  const kibblesService = new KibblesService(
    flowService,
    process.env.FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!
  );
  const kittyItemsService = new KittyItemsService(
    flowService,
    process.env.NON_FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!
  );
  const marketService = new MarketService(
    flowService,
    process.env.FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.NON_FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!
  );

  const app = initApp(
    knexInstance,
    kibblesService,
    kittyItemsService,
    marketService
  );

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

run().catch((e) => {
  console.error("error", e);
  process.exit(1);
});
