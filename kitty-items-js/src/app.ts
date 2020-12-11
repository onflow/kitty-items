import "express-async-errors";
import express, { Request, Response } from "express";
import { KibblesService } from "./services/kibbles";
import initKibblesRouter from "./routes/kibbles";
import { validateRequest } from "./middlewares/validate-request";

const V1 = "/v1/";

const initApp = (kibblesService: KibblesService) => {
  const app = express();

  app.use(validateRequest);

  app.use(V1, initKibblesRouter(kibblesService));

  app.all("*", async (req: Request, res: Response) => {
    return res.sendStatus(404);
  });

  return app;
};

export default initApp;
