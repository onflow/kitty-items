import express, { Request, Response, Router } from "express";
import { KittyItemsService } from "../services/kittyItems";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initKittyItemsRouter(kittyItemsService: KittyItemsService): Router {
  const router = express.Router();

  router.post(
    "/kitty-items/mint",
    [
      body("recipient").exists(),
      body("typeId").isInt(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, typeId } = req.body;
      const txId = await kittyItemsService.mintKittyItem(
        recipient,
        typeId
      );
      return res.send({
        transactionId: txId,
      });
    }
  );

  router.post(
    "/kitty-items/transfer",
    [
      body("recipient").exists(),
      body("itemId").isInt(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, itemId } = req.body;
      const txId = await kittyItemsService.transferKittyItem(
        recipient,
        itemId
      );
      return res.send({
        transactionId: txId,
      });
    }
  );

  router.get(
    "/kitty-items/collection/:account",
    async (req: Request, res: Response) => {
      const response = await kittyItemsService.getCollectionIds(req.params.account);
      return res.send({
        response
      });
    }
  );

  router.get(
    "/kitty-items/item/:itemId",
    async (req: Request, res: Response) => {
      const response = await kittyItemsService.getKittyItemType(parseInt(req.params.itemId));
      return res.send({
        response
      });
    }
  );

  router.get(
    "/kitty-items/supply",
    async (req: Request, res: Response) => {
      const totalSupply = await kittyItemsService.getKittyItemsSupply();
      return res.send({
        totalSupply
      });
    }
  );

  return router;
}

export default initKittyItemsRouter;
