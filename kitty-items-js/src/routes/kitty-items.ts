import express, { Request, Response, Router } from "express";
import { KittyItemsService } from "../services/kitty-items";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initKittyItemsRouter(kittyItemsService: KittyItemsService): Router {
  const router = express.Router();

  router.post(
    "/kitty-items/mint",
    [body("recipient").exists(), body("typeId").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, typeId } = req.body;
      const tx = await kittyItemsService.mint(recipient, typeId);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.post(
    "/kitty-items/transfer",
    [body("recipient").exists(), body("itemId").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, itemId } = req.body;
      const tx = await kittyItemsService.transfer(recipient, itemId);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.get(
    "/kitty-items/collection/:account",
    async (req: Request, res: Response) => {
      const collection = await kittyItemsService.getCollectionIds(
        req.params.account
      );
      return res.send({
        collection,
      });
    }
  );

  router.get(
    "/kitty-items/item/:itemId",
    async (req: Request, res: Response) => {
      const item = await kittyItemsService.getKittyItemType(
        parseInt(req.params.itemId)
      );
      return res.send({
        item,
      });
    }
  );

  router.get("/kitty-items/supply", async (req: Request, res: Response) => {
    const supply = await kittyItemsService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initKittyItemsRouter;
