import express, { Request, Response, Router } from "express";
import { body } from "express-validator";
import { DeployerService } from "../services/deployer";

function initDeployerRouter(deployerService: DeployerService): Router {
  const router = express.Router();

  router.get(
    "/deploy",
    async (req: Request, res: Response) => {
      const response = await deployerService.deploy();
      return res.send({
        response,
      });
    }
  );

  return router;
}

export default initDeployerRouter;
