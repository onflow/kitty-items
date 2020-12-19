import { SaleOfferHandler } from "./sale-offer";
import { Model } from "objection";
import Knex from "knex";
import * as dotenv from "dotenv";
import { BlockCursorService } from "../services/block-cursor";

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
  const blockCursorService = new BlockCursorService();
  new SaleOfferHandler(blockCursorService).run();
}

run().catch((e) => console.error("error", e));
