import express, { Request, Response, Router } from "express";
import { KibblesService } from "../services/kibbles";

function initKibblesRouter(kibblesService: KibblesService): Router {
  const router = express.Router();

  router.post("/kibbles", async (req: Request, res: Response) => {
    res.send("ok");
  });

  return router;
}

export default initKibblesRouter;
