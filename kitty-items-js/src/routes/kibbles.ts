import express, { Request, Response, Router } from "express";
import { KibblesService } from "../services/kibbles";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initKibblesRouter(kibblesService: KibblesService): Router {
  const router = express.Router();

  router.post(
    "/kibbles/mint",
    [body("recipient").exists(), body("amount").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;

      const transaction = await kibblesService.mint(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post("/kibbles/setup", async (req: Request, res: Response) => {
    const transaction = await kibblesService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/kibbles/burn",
    [
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { amount } = req.body;
      const transaction = await kibblesService.burn(amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post(
    "/kibbles/transfer",
    [
      body("recipient").exists(),
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;
      const transaction = await kibblesService.transfer(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.get(
    "/kibbles/balance/:account",
    async (req: Request, res: Response) => {
      const balance = await kibblesService.getBalance(req.params.account);
      return res.send({
        balance,
      });
    }
  );

  router.get("/kibbles/supply", async (req: Request, res: Response) => {
    const supply = await kibblesService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initKibblesRouter;
