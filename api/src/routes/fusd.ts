import express, { Request, Response, Router } from "express";

import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";
import { FUSDService } from "../services/fusd";

function initFUSDRouter(fusdService: FUSDService): Router {
  const router = express.Router();

  router.post(
    "/fusd/mint",
    [body("recipient").exists(), body("amount").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;

      const transaction = await fusdService.mint(recipient, amount);
      return res.send({
        transaction
      });
    }
  );

  router.post("/fusd/setup", async (req: Request, res: Response) => {
    const transaction = await fusdService.setupAccount();
    return res.send({
      transaction
    });
  });

  router.post(
    "/fusd/transfer",
    [body("recipient").exists(), body("amount").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;
      const transaction = await fusdService.transfer(recipient, amount);
      return res.send({
        transaction
      });
    }
  );

  router.get("/fusd/balance/:account", async (req: Request, res: Response) => {
    const balance = await fusdService.getBalance(req.params.account);
    return res.send({
      balance
    });
  });

  return router;
}

export default initFUSDRouter;
