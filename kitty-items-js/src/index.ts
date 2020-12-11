import initApp from "./app";
import { KibblesService } from "./services/kibbles";
import { FlowService } from "./services/flow";

async function run() {
  const flowService = new FlowService();
  const kibblesService = new KibblesService(flowService);

  const app = initApp(kibblesService);

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

run().catch((e) => {
  console.error("error", e);
  process.exit(1);
});
