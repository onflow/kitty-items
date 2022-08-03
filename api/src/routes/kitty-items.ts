/**
 * Kitty Items Router
 * 
 * Router class that defines API REST endpoints used for minting and moving Kitty Items.
 * Endpoints call kitty-items service with request data.
 *
 */
import express, {Request, Response, Router} from "express"
import {body} from "express-validator"
import {validateRequest} from "../middlewares/validate-request"
import {KittyItemsService} from "../services/kitty-items"

function initKittyItemsRouter(kittyItemsService: KittyItemsService): Router {
  const router = express.Router()

  router.post(
    "/kitty-items/mint",
    [body("recipient").exists()],
    validateRequest,
    async (req: Request, res: Response) => {
      const {recipient} = req.body
      const tx = await kittyItemsService.mint(recipient)
      return res.send({
        transaction: tx,
      })
    }
  )

  router.post(
    "/kitty-items/mint-and-list",
    [body("recipient").exists()],
    validateRequest,
    async (req: Request, res: Response) => {
      const {recipient} = req.body
      const tx = await kittyItemsService.mintAndList(recipient)
      return res.send({
        transaction: tx,
      })
    }
  )

  router.post("/kitty-items/setup", async (req: Request, res: Response) => {
    const transaction = await kittyItemsService.setupAccount()
    return res.send({
      transaction,
    })
  })

  router.post(
    "/kitty-items/transfer",
    [body("recipient").exists(), body("itemID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const {recipient, itemID} = req.body
      const tx = await kittyItemsService.transfer(recipient, itemID)
      return res.send({
        transaction: tx,
      })
    }
  )

  router.get(
    "/kitty-items/collection/:account",
    async (req: Request, res: Response) => {
      const collection = await kittyItemsService.getCollectionIds(
        req.params.account
      )
      return res.send({
        collection,
      })
    }
  )

  router.get(
    "/kitty-items/item/:address/:itemID",
    async (req: Request, res: Response) => {
      const item = await kittyItemsService.getKittyItem(
        req.params.itemID,
        req.params.address
      )
      return res.send({
        item,
      })
    }
  )

  router.get("/kitty-items/supply", async (req: Request, res: Response) => {
    const supply = await kittyItemsService.getSupply()
    return res.send({
      supply,
    })
  })

  return router
}

export default initKittyItemsRouter
