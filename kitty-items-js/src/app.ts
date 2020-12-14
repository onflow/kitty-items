import "express-async-errors";
import express, { Request, Response } from "express";
import { KibblesService } from "./services/kibbles";
import initKibblesRouter from "./routes/kibbles";
import { KittyItemsService } from "./services/kittyItems";
import initKittyItemsRouter from './routes/KittyItems';
import { json, urlencoded } from "body-parser";
import { MarketService } from "./services/market";
import initMarketRouter from './routes/market';

const V1 = "/v1/";

const initApp = (
  kibblesService: KibblesService,
  kittyItemsService: KittyItemsService,
  marketService: MarketService
) => {
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
