import * as fcl from "@onflow/fcl";

import Knex from "knex";

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import initApp from "./app";
import { getConfig } from "./config";

import { BlockCursorService } from "./services/block-cursor";
import { FlowService } from "./services/flow";
import { KibblesService } from "./services/kibbles";
import { KittyItemsService } from "./services/kitty-items";
import { MarketService } from "./services/market";
import { SaleOfferHandler } from "./workers/sale-offer-handler";

let knexInstance: Knex;
const argv = yargs(hideBin(process.argv)).argv;

async function run() {
  const config = getConfig();

  knexInstance = Knex({
    client: "postgresql",
    connection: {
      connectionString: config.databaseUrl,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    },
    migrations: {
      directory: config.databaseMigrationPath,
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

  const flowService = new FlowService(
    config.minterAddress,
    config.minterPrivateKeyHex,
    config.minterAccountKeyIndex
  );

  const marketService = new MarketService(
    flowService,
    config.fungibleTokenAddress,
    config.minterAddress,
    config.nonFungibleTokenAddress,
    config.minterAddress,
    config.minterAddress
  );

  if (argv.worker) {
    const blockCursorService = new BlockCursorService();

    const saleOfferWorker = new SaleOfferHandler(
      marketService,
      blockCursorService,
      flowService
    );

    saleOfferWorker.run();
  } else {
    // Make sure we're pointing to the correct Flow Access API.
    fcl.config().put("accessNode.api", config.accessApi);

    const kibblesService = new KibblesService(
      flowService,
      config.fungibleTokenAddress,
      config.minterAddress
    );

    const kittyItemsService = new KittyItemsService(
      flowService,
      config.nonFungibleTokenAddress,
      config.minterAddress
    );

    const app = initApp(
      knexInstance,
      kibblesService,
      kittyItemsService,
      marketService
    );

    app.listen(config.port, () => {
      console.log(`Listening on port ${config.port}!`);
    });
  }
}

const redOutput = "\x1b[31m%s\x1b[0m";

run().catch((e) => {
  console.error(redOutput, e);
  process.exit(1);
});
