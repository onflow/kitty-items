import express, { Request, Response, Router } from "express";
import { SaleOffersService } from "../services/sale-offers";

function initSaleOffersRouter(saleOffersService: SaleOffersService): Router {
  const router = express.Router();

  router.get("/sale-offers/latest", async (req: Request, res: Response) => {
    const saleOffers = await saleOffersService.findMostRecentSales();
    return res.send({
      saleOffers,
    });
  });

  return router;
}

export default initSaleOffersRouter;
