import express, { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { MarketService } from "../services/market";

function initMarketRouter(marketService: MarketService): Router {
  const router = express.Router();

  router.post(
    "/market/buy",
    [
      body("account").exists(),
      body("itemId").isInt(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { account, itemId } = req.body;
      const txId = await marketService.buyItem(
        account,
        itemId
      );
      return res.send({
        transactionId: txId,
      });
    }
  );

  router.post(
    "/market/sell",
    [
      body("itemId").isInt(),
      body("price").isFloat(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { itemId, price } = req.body;
      const txId = await marketService.sellItem(
        itemId,
        price
      );
      return res.send({
        transactionId: txId,
      });
    }
  );

  router.get(
    "/market/collection/:account",
    async (req: Request, res: Response) => {
      const response = await marketService.getItems(req.params.account);
      return res.send({
        response
      });
    }
  );

  router.get(
    "/market/collection/:account/:item",
    async (req: Request, res: Response) => {
      const response = await marketService.getItem(req.params.account, parseInt(req.params.item));
      return res.send({
        response
      });
    }
  );

  return router;
}

export default initMarketRouter;