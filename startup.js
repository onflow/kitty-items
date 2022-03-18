import pm2 from "pm2";
import inquirer from "inquirer";
import util from "util";
import jetpack from "fs-jetpack";
import dotenv from "dotenv";
import { exec as exe } from "child_process";
import ora from "ora";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { stderr } from "process";
const exec = util.promisify(exe);

//////////////////////////////////////////////////////////////////
// ---------------------- FLOW COMMANDS --------------------------
//////////////////////////////////////////////////////////////////

const EMULATOR_DEPLOYMENT =
  "project deploy -o json --network=emulator -f flow.json --update";
const TESTNET_DEPLOYMENT =
  "project deploy -o json --network=testnet -f flow.json -f flow.testnet.json --update";

function initializeStorefront(network) {
  if (!network) return envErr();
  return `transactions send -o json --network=${network} --signer ${network}-account ./cadence/transactions/nftStorefront/setup_account.cdc -f flow.json ${
    network !== "emulator" ? `-f flow.${network}.json` : ""
  }`;
}

function initializeKittyItems(network) {
  if (!network) return envErr();
  return `transactions send -o json --network=${network} --signer ${network}-account ./cadence/transactions/kittyItems/setup_account.cdc -f flow.json ${
    network !== "emulator" ? `-f flow.${network}.json` : ""
  }`;
}

//////////////////////////////////////////////////////////////////
// ------------------- HELPER FUNCTIONS -----------------------
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

function runProcess(config, cb = () => {}) {
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

    spinner.info(
      `Flow Emulator is running at: ${chalk.yellow("http://localhost:8080")}`
    );
    spinner.info(
      `View log output: ${chalk.cyanBright("npx pm2 logs emulator")}${"\n"}`
    );
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

      spinner.info(
        `Testnet envronment config was written to: .env.testnet.local${"\n"}`
      );
    } else {
      throw new Error("Not implemented.");
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

    spinner.info(
      `Kitty Items API is running at: ${chalk.yellow("http://localhost:3000")}`
    );
    spinner.info(
      `View log output: ${chalk.cyanBright("npx pm2 logs api")}${"\n"}`
    );

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

    spinner.info(
      `Kitty Items Web App is running at: ${chalk.yellow(
        "http://localhost:3001"
      )}`
    );
    spinner.info(
      `View log output: ${chalk.cyanBright("npx pm2 logs web")}${"\n"}`
    );

    spinner.start(
      `Deploying contracts to:  ${process.env.ADMIN_ADDRESS} (${process.env.CHAIN_ENV})`
    );

    const { stdout: out1, stderr: err1 } = await exec(
      `flow ${deploy(process.env.CHAIN_ENV)}`,
      { cwd: process.cwd() }
    );

    if (err1) {
      throw new Error(err1);
    }

    spinner.succeed(chalk.greenBright("Contracts deployed"));

    spinner.info(
      `Contracts were deployed to: ${process.env.ADMIN_ADDRESS} (${
        process.env.CHAIN_ENV
      })${"\n"}`
    );

    spinner.start(
      `Initializing admin account: ${process.env.ADMIN_ADDRESS} (${process.env.CHAIN_ENV})`
    );

    const { stdout: out2, stderr: err2 } = await exec(
      `flow ${initializeKittyItems(process.env.CHAIN_ENV)}`,
      { cwd: process.cwd() }
    );

    if (err2) {
      throw new Error(err2);
    }

    const { stdout: out3, stderr: err3 } = await exec(
      `flow ${initializeStorefront(process.env.CHAIN_ENV)}`,
      { cwd: process.cwd() }
    );

    if (err3) {
      throw new Error(err3);
    }
  } catch (e) {
    throw e;
  }

  spinner.succeed(chalk.greenBright("Admin account initialized"));

  spinner.info(
    `${chalk.cyanBright(
      "./cadence/transactions/nftStorefront/setup_account.cdc"
    )} was executed successfully.`
  );
  spinner.info(
    `${chalk.cyanBright(
      "./cadence/transactions/kittyItems/setup_account.cdc"
    )} was executed successfully.${"\n"}`
  );

  // ------------------------------------------------------------
  // --------------------- OUTPUT -------------------------------

  const rainbow = chalkAnimation.rainbow("KITTY ITEMS HAS STARTED");

  setTimeout(() => {
    rainbow.stop();
    console.log("\n");
    console.log(`${chalk.cyanBright("Visit")}: http://localhost:3001`);
    console.log("\n");
    if (process.env.CHAIN_ENV !== "emulator") {
      console.log(
        `${chalk.cyanBright(
          `View your account and transactions here:${"\n"}`
        )}https://${
          process.env.CHAIN_ENV === "testnet" ? "testnet." : ""
        }flowscan.org/account/${process.env.ADMIN_ADDRESS}\n`
      );

      console.log(
        `${chalk.cyanBright(
          `Explore your account here:${"\n"}`
        )}https://flow-view-source.com/${process.env.CHAIN_ENV}/account/${
          process.env.ADMIN_ADDRESS
        }\n`
      );
    }
    pm2.disconnect();
  }, 3000);

  //////////////////////////////////////////////////////////////////
  // ------------- END PROCESS MANAGEMENT ENTRYPOINT ---------------
  //////////////////////////////////////////////////////////////////
});
