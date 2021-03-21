import express, { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { MarketService } from "../services/market";

function initMarketRouter(marketService: MarketService): Router {
  const router = express.Router();

  router.post(
    "/market/buy",
    [body("account").exists(), body("itemID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { account, itemID } = req.body;
      const tx = await marketService.buy(account, itemID);
      return res.send({
        transactionId: tx,
      });
    }
  );

  router.post("/market/setup", async (req: Request, res: Response) => {
    const tx = await marketService.setupAccount();
    return res.send({
      transactionId: tx,
    });
  });

  router.post(
    "/market/sell",
    [body("itemID").isInt(), body("price").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { itemID, price } = req.body;
      const tx = await marketService.sell(itemID, price);
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
