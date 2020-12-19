import { SaleOfferHandler } from "./sale-offer";
import { Model } from "objection";
import Knex from "knex";
import * as dotenv from "dotenv";
import * as fcl from "@onflow/fcl";
import { BlockCursorService } from "../services/block-cursor";
import { FlowService } from "../services/flow";

async function run() {
  dotenv.config();
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
  new SaleOfferHandler(blockCursorService, flowService).run();
}

run().catch((e) => console.error("error", e));
