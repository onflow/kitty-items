import express, { Request, Response, Router } from "express";
import { KibblesService } from "../services/kibbles";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initKibblesRouter(kibblesService: KibblesService): Router {
  const router = express.Router();

  router.post(
    "/kibbles",
    [
      body("flowAddress").exists(),
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      res.send("ok");
    }
  );

  return router;
}

export default initKibblesRouter;
