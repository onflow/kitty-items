import express from 'express';
import * as dotenv from "dotenv";
import * as fcl from "@onflow/fcl";

class KittyItemsApp {

  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeControllers(controllers);
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      dotenv.config();
      fcl.config().put("accessNode.api", process.env.FLOW_NODE);
      console.log(`⚡️[server]: Server is running at https://localhost:${this.port}`);
    });
  }
}

export default KittyItemsApp;