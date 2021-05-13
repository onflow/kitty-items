import "express-async-errors";

import path from "path";

import express, { Request, Response } from "express";

import cors from "cors";

import { json, urlencoded } from "body-parser";

import initKibblesRouter from "./routes/kibbles";
import initKittyItemsRouter from "./routes/kitty-items";
import initMarketRouter from "./routes/market";
import { KibblesService } from "./services/kibbles";
import { KittyItemsService } from "./services/kitty-items";
import { MarketService } from "./services/market";

const V1 = "/v1/";

// Init all routes, setup middlewares and dependencies
const initApp = (
  kibblesService: KibblesService,
  kittyItemsService: KittyItemsService,
  marketService: MarketService
) => {
  const app = express();

  // @ts-ignore
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, initKibblesRouter(kibblesService));
  app.use(V1, initKittyItemsRouter(kittyItemsService));
  app.use(V1, initMarketRouter(marketService));

  if (process.env.IS_HEROKU) {
    // Serve React static site using Express when deployed to Heroku.
    app.use(express.static(path.resolve(__dirname, "../../web/build")));
    app.get("*", function (req, res) {
      res.sendFile(path.resolve(__dirname, "../../web/build/index.html"));
    });
  }

  app.all("*", async (req: Request, res: Response) => {
    return res.sendStatus(404);
  });

  return app;
};

export default initApp;
