import express, { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { MarketService } from "../services/market";

function initMarketRouter(marketService: MarketService): Router {
  const router = express.Router();

  router.post(
    "/market/buy",
    [body("account").exists(), body("itemId").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { account, itemId } = req.body;
      const tx = await marketService.buy(account, itemId);
      return res.send({
        transactionId: tx,
      });
    }
  );

  router.post(
    "/market/sell",
    [body("itemId").isInt(), body("price").isFloat()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { itemId, price } = req.body;
      const tx = await marketService.sell(itemId, price);
      return res.send({
        transactionId: tx,
      });
    }
  );

  router.get(
    "/market/collection/:account",
    async (req: Request, res: Response) => {
      const items = await marketService.getItems(req.params.account);
      return res.send({
        items,
      });
    }
  );

  router.get(
    "/market/collection/:account/:item",
    async (req: Request, res: Response) => {
      const item = await marketService.getItem(
        req.params.account,
        parseInt(req.params.item)
      );
      return res.send({
        item,
      });
    }
  );

  router.get("/market/latest", async (req: Request, res: Response) => {
    const latestSaleOffers = await marketService.findMostRecentSales();
    return res.send({
      latestSaleOffers,
    });
  });

  return router;
}

export default initMarketRouter;
