import { Model } from "objection";
import pg from "pg";
import Knex from "knex";
import * as dotenv from "dotenv";
import * as fcl from "@onflow/fcl";

import { SaleOfferHandler } from "./sale-offer-handler";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { MarketService } from "../services/market";

async function run() {
  dotenv.config({
    path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
  });

  // Workaround for 'pg' considering bigint as 'text': https://github.com/knex/knex/issues/387
  pg.types.setTypeParser(20, "text", parseInt);
  
  const knexInstance = Knex({
    client: "postgresql",
    connection: process.env.DATABASE_URL!,
    migrations: {
      directory: "./src/migrations",
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
  fcl.config().put("accessNode.api", process.env.FLOW_ACCESS_API);

  const minterAddress = fcl.withPrefix(process.env.MINTER_FLOW_ADDRESS!);
  const fungibleTokenAddress = fcl.withPrefix(process.env.FUNGIBLE_TOKEN_ADDRESS!);
  const nonFungibleTokenAddress = fcl.withPrefix(process.env.NON_FUNGIBLE_TOKEN_ADDRESS!);

  const blockCursorService = new BlockCursorService();

  const flowService = new FlowService(
    minterAddress,
    process.env.MINTER_PRIVATE_KEY!,
    process.env.MINTER_ACCOUNT_KEY_IDX!
  );

  const marketService = new MarketService(
    flowService,
    fungibleTokenAddress,
    minterAddress,
    nonFungibleTokenAddress,
    minterAddress,
    minterAddress
  );

  await new SaleOfferHandler(
    blockCursorService,
    flowService,
    marketService,
    `A.${fcl.sansPrefix(minterAddress)}.KittyItemsMarket.SaleOfferCreated`  
  ).run();
}

run().catch((e) => console.error("error", e));
