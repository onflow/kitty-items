#!/usr/bin/env node
import { chalk } from "zx";
import replace from "replace-in-file";
const env = process.argv.pop();

const files = ["./api/.env.local", "./web/.env.local"];

switch (env.toLowerCase()) {
  case "help":
    console.log(
      chalk.magentaBright(
        "This script is a utility for easily switching between environments in Kitty Items"
      )
    );
    break;
  case "testnet":
    console.log(chalk.green("Switching to testnet"));
    break;
  case "emulator":
    console.log(chalk.green("Switching to emulator"));
    break;
  default:
    console.log("Unknown env. You entered:", chalk.red(env));
    console.log(
      chalk.yellow(
        `Available options: ${chalk.green("testnet")} or ${chalk.green(
          "emulator"
        )}`
      )
    );
}
