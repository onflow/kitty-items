import "express-async-errors";
import express, { Request, Response } from "express";
import Knex from "knex";
import { Model } from "objection";
import { json, urlencoded } from "body-parser";
import { KibblesService } from "./services/kibbles";
import { KittyItemsService } from "./services/kitty-items";
import { MarketService } from "./services/market";
import initKibblesRouter from "./routes/kibbles";
import initKittyItemsRouter from "./routes/kitty-items";
import initMarketRouter from "./routes/market";

const V1 = "/v1/";

const initApp = (
  knex: Knex,
  kibblesService: KibblesService,
  kittyItemsService: KittyItemsService,
  marketService: MarketService
) => {
  Model.knex(knex);
  const app = express();

  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, initKibblesRouter(kibblesService));
  app.use(V1, initKittyItemsRouter(kittyItemsService));
  app.use(V1, initMarketRouter(marketService));

  app.all("*", async (req: Request, res: Response) => {
    return res.sendStatus(404);
  });

  return app;
};

export default initApp;
