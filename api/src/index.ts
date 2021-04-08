import * as fcl from "@onflow/fcl";

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import initApp from "./app";
import { getConfig } from "./config";
import initDB from "./db";

import { BlockCursorService } from "./services/block-cursor";
import { FlowService } from "./services/flow";
import { KibblesService } from "./services/kibbles";
import { KittyItemsService } from "./services/kitty-items";
import { MarketService } from "./services/market";
import { SaleOfferHandler } from "./workers/sale-offer-handler";

const argv = yargs(hideBin(process.argv)).argv;

async function run() {
  const config = getConfig();
  const db = initDB(config);

  // Make sure to disconnect from DB when exiting the process
  process.on("SIGTERM", () => {
    db.destroy().then(() => {
      process.exit(0);
    });
  });

  // Run all database migrations
  await db.migrate.latest();

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

  // Make sure we're pointing to the correct Flow Access API.
  fcl.config().put("accessNode.api", config.accessApi);

  if (argv.worker) {
    const blockCursorService = new BlockCursorService();

    const saleOfferWorker = new SaleOfferHandler(
      marketService,
      blockCursorService,
      flowService
    );

    saleOfferWorker.run();
  } else {
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

    const app = initApp(kibblesService, kittyItemsService, marketService);

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
