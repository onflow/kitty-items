import * as fcl from "@onflow/fcl";

// TODO: this is a temporary fix, remove when https://github.com/onflow/flow-js-sdk/issues/727 is released
fcl
  .config()
  .put("decoder.Type", val => val.staticType)
  .put("decoder.Enum", val => val);

