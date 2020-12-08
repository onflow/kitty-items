import express from 'express';
import * as bodyParser from 'body-parser';
import * as kibblesService from '../services/kibbles';

class KibblesController {
  public router = express.Router();
  urlencodedParser = bodyParser.urlencoded({ extended: false })
  constructor() {
    this.router.post('/mint', this.urlencodedParser, this.mint);
  }

  mint = async (request: express.Request, response: express.Response) => {
    const receiverAddr = request.body.receiverAddr;
    const amount = request.body.amount;
    const result = await kibblesService.mint({ receiverAddr, amount: parseInt(amount, 10) });
    response.send(result.events[0].transactionId);
  }
}

export default KibblesController;