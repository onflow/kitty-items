import express, { Request, Response } from "express";

const router = express.Router();

router.post("/kibbles", async (req: Request, res: Response) => {
  res.send("ok");
});

export default router;
