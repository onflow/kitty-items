import express from "express";
import { KibblesService } from "./services/kibbles";
import initKibblesRouter from "./routes/kibbles";

const initApp = (kibblesService: KibblesService) => {
  const app = express();

  app.use("/v1/", initKibblesRouter(kibblesService));

  return app;
};

export default initApp;
