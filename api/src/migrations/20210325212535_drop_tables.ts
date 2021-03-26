import * as Knex from "knex";

import * as kittyItems from "./20201217175515_create_kitty_items";
import * as saleOffers from "./20201217175722_create_sale_offers";

export async function up(knex: Knex): Promise<void> {
  await kittyItems.down(knex);
  await saleOffers.down(knex);
}

export async function down(knex: Knex): Promise<void> {
  await kittyItems.up(knex);
  await saleOffers.up(knex);
}
