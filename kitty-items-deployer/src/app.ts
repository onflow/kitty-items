import "express-async-errors";
import express, { Request, Response } from "express";
import { json, urlencoded } from "body-parser";
import { DeployerService } from "./services/deployer";
import initDeployerRouter from './routes/deployer';

const V1 = "/v1/";

const initApp = (deployerService: DeployerService) => {
  const app = express();
  
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, initDeployerRouter(deployerService));
  app.all("*", async (req: Request, res: Response) => {
    return res.sendStatus(404);
  });

  return app;
};

export default initApp;
