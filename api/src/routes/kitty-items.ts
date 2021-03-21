import express, { Request, Response, Router } from "express";
import { KittyItemsService } from "../services/kitty-items";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initKittyItemsRouter(kittyItemsService: KittyItemsService): Router {
  const router = express.Router();

  router.post(
    "/kitty-items/mint",
    [body("recipient").exists(), body("typeID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, typeID } = req.body;
      const tx = await kittyItemsService.mint(recipient, typeID);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.post("/kitty-items/setup", async (req: Request, res: Response) => {
    const transaction = await kittyItemsService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/kitty-items/transfer",
    [body("recipient").exists(), body("itemID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, itemID } = req.body;
      const tx = await kittyItemsService.transfer(recipient, itemID);
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
    "/kitty-items/item/:itemID",
    async (req: Request, res: Response) => {
      const item = await kittyItemsService.getKittyItemType(
        parseInt(req.params.itemID)
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
