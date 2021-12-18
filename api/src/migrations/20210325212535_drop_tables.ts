import {Knex} from "knex"

import * as kittyItems from "./20201217175515_create_kitty_items"
import * as listings from "./20201217175722_create_listing"

export async function up(knex: Knex): Promise<void> {
  await kittyItems.down(knex)
  await listings.down(knex)
}

export async function down(knex: Knex): Promise<void> {
  await kittyItems.up(knex)
  await listings.up(knex)
}
