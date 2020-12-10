import express from "express";
import kibblesRouter from "./routes/kibbles";

const app = express();

app.use("/v1/", kibblesRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
