import * as fcl from "@onflow/fcl";

import * as dotenv from "dotenv";

import Knex from "knex";

import initApp from "./app";

import { FlowService } from "./services/flow";
import { KibblesService } from "./services/kibbles";
import { KittyItemsService } from "./services/kitty-items";
import { MarketService } from "./services/market";

let knexInstance: Knex;
const envPath = async function run() {
  dotenv.config({
    path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
  });

  knexInstance = Knex({
    client: "postgresql",
    connection: process.env.DATABASE_URL!,
    migrations: {
      directory: process.env.MIGRATION_PATH || "./src/migrations",
    },
  });

  // Make sure to disconnect from DB when exiting the process
  process.on("SIGTERM", () => {
    knexInstance.destroy().then(() => {
      process.exit(0);
    });
  });

  // Run all database migrations
  await knexInstance.migrate.latest();

  // Make sure we're pointing to the correct Flow Access node.
  fcl.config().put("accessNode.api", process.env.FLOW_ACCESS_NODE);

  const minterAddress = fcl.withPrefix(process.env.MINTER_FLOW_ADDRESS!);
  const fungibleTokenAddress = fcl.withPrefix(
    process.env.FUNGIBLE_TOKEN_ADDRESS!
  );
  const nonFungibleTokenAddress = fcl.withPrefix(
    process.env.NON_FUNGIBLE_TOKEN_ADDRESS!
  );

  const flowService = new FlowService(
    minterAddress,
    process.env.MINTER_PRIVATE_KEY!,
    process.env.MINTER_ACCOUNT_KEY_IDX!
  );

  const kibblesService = new KibblesService(
    flowService,
    fungibleTokenAddress,
    minterAddress
  );

  const kittyItemsService = new KittyItemsService(
    flowService,
    nonFungibleTokenAddress,
    minterAddress
  );

  const marketService = new MarketService(
    flowService,
    fungibleTokenAddress,
    minterAddress,
    nonFungibleTokenAddress,
    minterAddress,
    minterAddress
  );

  const app = initApp(
    knexInstance,
    kibblesService,
    kittyItemsService,
    marketService
  );

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
};

run().catch((e) => {
  console.error("error", e);
  process.exit(1);
});
