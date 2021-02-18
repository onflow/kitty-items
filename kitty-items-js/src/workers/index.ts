import * as fcl from "@onflow/fcl";

import { Model } from "objection";

import pg from "pg";

import Knex from "knex";

import * as dotenv from "dotenv";

import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { MarketService } from "../services/market";

import { SaleOfferHandler } from "./sale-offer-handler";

async function run() {
  dotenv.config();
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
  fcl.config().put("accessNode.api", process.env.FLOW_NODE);
  const blockCursorService = new BlockCursorService();
  const flowService = new FlowService(
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.MINTER_PRIVATE_KEY!,
    process.env.MINTER_ACCOUNT_KEY_IDX!
  );
  const marketService = new MarketService(
    flowService,
    process.env.FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.NON_FUNGIBLE_TOKEN_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!,
    process.env.MINTER_FLOW_ADDRESS!
  );
  await new SaleOfferHandler(
    blockCursorService,
    flowService,
    marketService,
    [
      process.env.FUNGIBLE_TOKEN_ADDRESS!,
      process.env.NON_FUNGIBLE_TOKEN_ADDRESS!,
      process.env.EVENT_SALE_OFFER_CREATED!,
      process.env.EVENT_SALE_OFFER_ACCEPTED!,
      process.env.EVENT_SALE_OFFER_FINISHED!,
      process.env.EVENT_COLLECTION_INSERTED_SALE_OFFER!,
      process.env.EVENT_COLLECTION_REMOVED_SALE_OFFER!
    ]
  ).run();
}

run().catch((e) => console.error("error", e));
