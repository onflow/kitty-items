import pm2 from "pm2";
import inquirer from "inquirer";
import util from "util";
import jetpack from "fs-jetpack";
import dotenv from "dotenv";
import { exec as exe } from "child_process";
import ora from "ora";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
const exec = util.promisify(exe);

//////////////////////////////////////////////////////////////////
// ---------------------- FLOW COMMANDS --------------------------
//////////////////////////////////////////////////////////////////

const EMULATOR_DEPLOYMENT =
  "project deploy --network=emulator -f flow.json --update -o json";
const TESTNET_DEPLOYMENT =
  "project deploy --network=testnet -f flow.json -f flow.testnet.json --update -o json";

function initializeStorefront(network) {
  if (!network) return envErr();
  return `transactions send --network=testnet --signer ${network}-account ./cadence/transactions/nftStorefront/setup_account.cdc -f flow.json -f flow.${network}.json`;
}

function initializeKittyItems(network) {
  if (!network) return envErr();
  return `transactions send --network=testnet --signer ${network}-account ./cadence/transactions/kittyItems/setup_account.cdc -f flow.json -f flow.${network}.json`;
}

//////////////////////////////////////////////////////////////////
// ------------------- UTILITY FUNCTIONS -----------------------
//////////////////////////////////////////////////////////////////

function convertToEnv(object) {
  let envFile = "";
  for (const key of Object.keys(object)) {
    envFile += `${key}=${object[key]}\n`;
  }
  return envFile;
}

function envErr() {
  throw new Error(
    `Unknown or missing CHAIN_ENV environment variable.
         Please provide one of the following: "emulator", "testnet"`
  );
}

function adminError() {
  throw new Error(
    `Unknown or missing ADMIN_ADRESS environment variable.
      Please create a testnet account and add your credentials to .env.tenstnet.local`
  );
}

function deploy(chainEnv) {
  switch (chainEnv) {
    case "emulator":
      return EMULATOR_DEPLOYMENT;
    case "testnet":
      return TESTNET_DEPLOYMENT;
    default:
      envErr();
  }
}

async function generateKeys() {
  const { stdout: out, stderr: err } = await exec(
    `flow keys generate -o json`,
    { cwd: process.cwd() }
  );

  if (err) {
    console.log(err);
  }

  return JSON.parse(out);
}

function requireEnv(chainEnv) {
  switch (chainEnv) {
    case "emulator":
      return ".env.local";
    case "testnet":
      if (process.env.APP_ENV === "local") return ".env.testnet.local";
      throw new Error(
        "Testnet deployment config not created. See README.md for instructions."
      );
    default:
      envErr();
  }
}

async function runProcess(config, cb = () => {}) {
  return new Promise((resolve, reject) => {
    pm2.start(config, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
}

//////////////////////////////////////////////////////////////////
// ------------- PROCESS MANAGEMENT ENTRYPOINT -------------------
//////////////////////////////////////////////////////////////////

pm2.connect(true, async function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  const spinner = ora();
  spinner.spinner = "dots3";
  spinner.color = "green";
  let env = {};

  // ------------------------------------------------------------
  // ------------- EMULATOR DEPLOYMENT --------------------------

  if (process.env.CHAIN_ENV === "emulator") {
    spinner.start("Emulating Flow Network");

    await runProcess({
      name: "emulator",
      script: "/Users/mackenziekieran/Downloads/flow-x86_64-darwin-",
      args: "emulator --dev-wallet=true",
      wait_ready: true
    });

    spinner.succeed(chalk.greenBright("Emulator started"));
  }

  // ------------------------------------------------------------
  // ------------- TESTNET DEPLOYMENT ---------------------------

  if (process.env.CHAIN_ENV === "testnet") {
    let useExisting = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Have you previously created a testnet account using ${chalk.greenBright(
        "npm run dev:testnet"
      )} ?`,
      default: false
    });

    if (!useExisting.confirm) {
      console.log("Creating testnet new account keys...");

      const result = await generateKeys();

      console.log(`
      ${chalk.greenBright("Next steps:")}

      1. Create a new account using the testnet faucet by visiting this URL: 
      ${chalk.cyanBright(
        `https://testnet-faucet.onflow.org/?key=${result.public}&source=ki`
      )}

      2. Copy the new account address from the faucet, and paste it below 👇
      ${chalk.yellowBright("⚠️  Don't exit this terminal.")}
      `);

      const testnet = await inquirer.prompt([
        {
          type: "input",
          name: "account",
          message: "Paste your new testnet account address here:"
        }
      ]);

      result.account = testnet.account;

      jetpack.file(`testnet-credentials-${testnet.account}.json`, {
        content: JSON.stringify(result)
      });

      const testnetEnvFile = jetpack.read(".env.testnet.template");
      const buf = Buffer.from(testnetEnvFile);
      const parsed = dotenv.parse(buf);

      env = {
        ADMIN_ADDRESS: testnet.account,
        FLOW_PRIVATE_KEY: result.private,
        FLOW_PUBLIC_KEY: result.public
      };

      jetpack.file(".env.testnet.local", {
        content: `${convertToEnv({ ...parsed, ...env })}`
      });

      console.log(
        "Testnet envronment config was written to: .env.testnet.local"
      );
    } else {
      throw new Error("Not implemented.");
      // - check if .env.testnet.local exists
      // - check if .env.testnet.local has valid account address
      // - check if testnet-credentials-<account address>.json exists
      // - check if testnet-credentials-<account address>.json has valid keys
      // - if all good, use existing account
      // - if not, ask user to create new account
    }
  }

  // ------------------------------------------------------------
  // --------------------- DEPLOYMENT ---------------------------

  dotenv.config({
    path: requireEnv(process.env.CHAIN_ENV)
  });

  if (!process.env.ADMIN_ADDRESS) adminError();

  try {
    spinner.start("Starting API server");
    await runProcess({
      name: "api",
      cwd: "./api",
      script: "npm",
      args: "run dev",
      watch: false,
      wait_ready: true
    });

    spinner.succeed(chalk.greenBright("API server started"));

    spinner.start("Starting storefront web app");

    await runProcess({
      name: "web",
      cwd: "./web",
      script: "npm",
      args: "run dev",
      watch: false,
      wait_ready: true,
      autorestart: false
    });

    spinner.succeed(chalk.greenBright("Storefront web app started"));

    spinner.start(
      `Deploying contracts to:  ${process.env.ADMIN_ADDRESS} (${process.env.CHAIN_ENV})`
    );

    await runProcess({
      name: "contracts",
      script: "flow",
      args: deploy(process.env.CHAIN_ENV),
      autorestart: false,
      wait_ready: true,
      watch: ["cadence"]
    });

    spinner.succeed(chalk.greenBright("Contracts deployed"));

    spinner.start(
      `Initializing admin account: ${process.env.ADMIN_ADDRESS} (${process.env.CHAIN_ENV})`
    );

    await runProcess({
      name: "init kittyitems admin",
      script: "flow",
      args: initializeKittyItems(process.env.CHAIN_ENV),
      autorestart: false,
      wait_ready: true,
      kill_timeout: 5000
    });

    await runProcess({
      name: "init storefront admin",
      script: "flow",
      args: initializeStorefront(process.env.CHAIN_ENV),
      autorestart: false,
      wait_ready: true,
      kill_timeout: 5000
    });
  } catch (e) {
    throw e;
  }

  spinner.succeed(chalk.greenBright("Admin account initialized"));

  // ------------------------------------------------------------
  // --------------------- OUTPUT -------------------------------

  const rainbow = chalkAnimation.rainbow("KITTY ITEMS HAS STARTED");

  setTimeout(() => {
    rainbow.stop();
    console.log(`${chalk.cyanBright("Visit")}: http://localhost:3001`);
    pm2.disconnect();
  }, 3000);
});
