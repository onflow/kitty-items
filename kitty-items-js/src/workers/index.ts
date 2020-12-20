import { SaleOfferHandler } from "./sale-offer-handler";
import { Model } from "objection";
import pg from "pg";
import Knex from "knex";
import * as dotenv from "dotenv";
import * as fcl from "@onflow/fcl";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";
import { BaseEventHandler } from "./base-event-handler";
import { SaleOffersService } from "../services/sale-offers";

async function run() {
  dotenv.config();
  // Workaround for pg considering bigint as 'text': https://github.com/knex/knex/issues/387
  pg.types.setTypeParser(20, "text", parseInt);
  const knexInstance = Knex({
    client: "postgresql",
    connection: process.env.DATABASE_URL!,
    migrations: {
      directory: "./src/migrations",
    },
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
  const saleOfferService = new SaleOffersService();
  await new SaleOfferHandler(
    blockCursorService,
    flowService,
    saleOfferService
  ).run();
}

run().catch((e) => console.error("error", e));
