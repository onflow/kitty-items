import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("decoder.Type", val => val.staticType);
