import * as fcl from "@onflow/fcl";
import { Model } from "objection";
import pg from "pg";
import Knex from "knex";

import { getConfig } from "../config";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { MarketService } from "../services/market";
import { SaleOfferHandler } from "./sale-offer-handler";

async function run() {
  
  const config = getConfig();

  // Workaround for 'pg' considering bigint as 'text': https://github.com/knex/knex/issues/387
  pg.types.setTypeParser(20, "text", parseInt);
  
  const knexInstance = Knex({
    client: "postgresql",
    connection: config.databaseUrl,
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

  console.log("running handlers");

  Model.knex(knexInstance);

  // Make sure we're pointing to the correct Flow Access API.
  fcl.config().put("accessNode.api", config.accessApi);

  const blockCursorService = new BlockCursorService();

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

  const eventSaleOfferCreated = `A.${fcl.sansPrefix(config.minterAddress)}.KittyItemsMarket.SaleOfferCreated`;

  await new SaleOfferHandler(
    blockCursorService,
    flowService,
    marketService,
    eventSaleOfferCreated  
  ).run();
}

run().catch((e) => console.error("error", e));
