import pm2 from "pm2";

import inquirer from "inquirer";

import util from "util";

import jetpack from "fs-jetpack";

import dotenv from "dotenv";

import { exec as exe, spawn } from "child_process";

import ora from "ora";

import chalk from "chalk";

import chalkAnimation from "chalk-animation";

import { killPortProcess } from "kill-port-process";

const exec = util.promisify(exe);

const pjson = jetpack.read("package.json", "json");

const spinner = ora();
spinner.spinner = "dots3";
spinner.color = "green";

//////////////////////////////////////////////////////////////////
// ---------------------- FLOW COMMANDS --------------------------
//////////////////////////////////////////////////////////////////

const EMULATOR_DEPLOYMENT =
  "flow project deploy -o json --network=emulator -f flow.json --update";
const TESTNET_DEPLOYMENT =
  "flow project deploy -o json --network=testnet -f flow.json -f flow.testnet.json --update";

function initializeStorefront(network) {
  if (!network) return envErr();
  return `flow transactions send -o json --network=${network} --signer ${network}-account ./cadence/transactions/nftStorefront/setup_account.cdc -f flow.json ${
    network !== "emulator" ? `-f flow.${network}.json` : ""
  }`;
}

function initializeKittyItems(network) {
  if (!network) return envErr();
  return `flow transactions send -o json --network=${network} --signer ${network}-account ./cadence/transactions/kittyItems/setup_account.cdc -f flow.json ${
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
      Please create a testnet account and add your credentials to .env.tenstnet`
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
      return ".env.emulator";
    case "testnet":
      if (!jetpack.exists(".env.testnet")) {
        throw new Error(
          "Testnet deployment config not created. See README.md for instructions."
        );
      }
      return ".env.testnet";
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

function stopProcess(name, port) {
  return new Promise((resolve, reject) => {
    pm2.stop(name, function (err, result) {
      pm2.delete(name, async function () {
        await killPortProcess(port);
        resolve();
      });
    });
  });
}

async function cleanupTestnetConfig() {
  spinner.warn("Cleaning up old testnet config and database...");
  const dbExists = jetpack.exists("./api/kitty-items-db-testnet.sqlite");
  if (dbExists) {
    spinner.info(
      `We found an old testnet database. If you're starting a new testnet deployment, you can delete it.`
    );
    let removeDb = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Are you sure you want to remove the testnet database?`,
      default: true
    });
    if (removeDb.confirm) {
      spinner.info(`Removing testnet database...`);
      jetpack.remove("./api/kitty-items-db-testnet.sqlite");
      spinner.info(`Removing .env.testnet file...`);
      jetpack.remove(".env.testnet");
    } else {
      throw new Error(
        "You must remove the testnet database before starting a new deployment."
      );
    }
  }

  jetpack.remove("./.env.testnet");
  jetpack.remove("./api/kitty-items-db-testnet.sqlite");
}

//////////////////////////////////////////////////////////////////
// ------------- PROCESS MANAGEMENT ENTRYPOINT -------------------
//////////////////////////////////////////////////////////////////

pm2.connect(false, async function (err) {
  if (err) {
    console.error(err);
    pm2.disconnect();
    process.exit(2);
  }

  pm2.flush();

  let env = {};

  spinner.info(`Stopping previously launched processes...${"\n"}`);

  await stopProcess("api", [3000]);
  await stopProcess("web", [3001]);
  await stopProcess("dev-wallet", [8701]);
  await stopProcess("emulator", [8080, 3569]);

  // ------------------------------------------------------------
  // ------------- CHECK FOR CORRECT NODE VERSION ---------------

  if (
    !process.version.split(".")[0].includes(pjson.engines.node.split(".")[0])
  ) {
    spinner.warn(
      `This project requires Node version ${chalk.yellow(
        "16.x"
      )} or higher. Please install Node.js and try again.${"\n"}`
    );
    pm2.disconnect();
    return;
  }

  // ------------------------------------------------------------
  // ------------- TESTNET ACCOUNT CREATION ---------------------

  async function bootstrapNewTestnetAccount() {
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

    jetpack.file(".env.testnet", {
      content: `${convertToEnv({ ...parsed, ...env })}`
    });

    spinner.info(
      `Testnet envronment config was written to: .env.testnet${"\n"}`
    );

    dotenv.config({
      path: requireEnv(process.env.CHAIN_ENV)
    });
  }

  // ------------------------------------------------------------
  // ---------------- CONTRACT DEPLOYMENT -----------------------

  async function deployAndInitialize() {
    spinner.start(
      `Deploying contracts to:  ${process.env.ADMIN_ADDRESS} (${process.env.CHAIN_ENV})`
    );

    const { stdout: out1, stderr: err1 } = await exec(
      `${deploy(process.env.CHAIN_ENV)}`,
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

    // -------------- Initialize Kitty Items  --------------------------

    const { stderr: err2 } = await exec(
      initializeKittyItems(process.env.CHAIN_ENV),
      { cwd: process.cwd() }
    );

    if (err2) {
      throw new Error(err2);
    }

    // -------------- Initialize NFTStorefront --------------------------

    const { stderr: err3 } = await exec(
      initializeStorefront(process.env.CHAIN_ENV),
      { cwd: process.cwd() }
    );

    if (err3) {
      throw new Error(err3);
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
  }

  // ------------------------------------------------------------
  // ------------- EMULATOR ENVIRONMENT STARTUP -----------------

  if (process.env.CHAIN_ENV === "emulator") {
    spinner.start("Emulating Flow Network");

    await runProcess({
      name: "emulator",
      script: "flow",
      args: "emulator",
      wait_ready: true
    });

    spinner.succeed(chalk.greenBright("Emulator started"));

    spinner.info(
      `Flow Emulator is running at: ${chalk.yellow("http://localhost:8080")}`
    );
    spinner.info(
      `View log output: ${chalk.cyanBright("npx pm2 logs emulator")}${"\n"}`
    );

    spinner.start("Starting FCL Developer Wallet");

    await runProcess({
      name: "dev-wallet",
      script: "flow",
      args: "dev-wallet",
      wait_ready: true
    });

    spinner.succeed(chalk.greenBright("Developer Wallet started"));

    spinner.info(
      `FCL Dev Wallet running at: ${chalk.yellow("http://localhost:8701")}`
    );
    spinner.info(
      `View log output: ${chalk.cyanBright("npx pm2 logs dev-wallet")}${"\n"}`
    );

    // NOTE: Emulator development does not persist chain state by default.
    // If you add support for emulator persistence, you will need to remove this
    // because now your emulator will maintain all events from past runs, 
    // emitted by the Kitty Items contract, and the sale offers will match
    // with what is represented on-chain (what NFTs are for sale in which accounts).
    jetpack.remove("./api/kitty-items-db-emulator.sqlite");

    dotenv.config({
      path: requireEnv(process.env.CHAIN_ENV)
    });

    await deployAndInitialize();
  }

  // ------------------------------------------------------------
  // ------------- TESTNET ENVIRONMENT STARTUP ------------------

  if (process.env.CHAIN_ENV === "testnet") {
    const USE_EXISTING = jetpack.exists(".env.testnet");

    if (!USE_EXISTING) {
      await cleanupTestnetConfig();
      await bootstrapNewTestnetAccount();
      await deployAndInitialize();
    } else {
      let useExisting = await inquirer.prompt({
        type: "confirm",
        name: "confirm",
        message: `Use existing tesnet credentials in ${chalk.greenBright(
          "env.testnet"
        )} ?`,
        default: true
      });

      if (!useExisting.confirm) {
        spinner.warn("Creating new testnet account credentials...");
        await cleanupTestnetConfig();
        await bootstrapNewTestnetAccount();
        await deployAndInitialize();
      } else {
        dotenv.config({
          path: requireEnv(process.env.CHAIN_ENV)
        });
      }
    }
  }

  // ------------------------------------------------------------
  // --------------------- SERVICES STARTUP ---------------------

  if (!process.env.ADMIN_ADDRESS) adminError();

  spinner.start("Starting API server");

  await runProcess({
    name: `api`,
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
    `View log output: ${chalk.cyanBright(`npx pm2 logs api`)}${"\n"}`
  );

  spinner.start("Starting storefront web app");

  await runProcess({
    name: `web`,
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
    `View log output: ${chalk.cyanBright(`npx pm2 logs web`)}${"\n"}`
  );

  // ------------------------------------------------------------
  // --------------------- DONE -------------------------------

  const rainbow = chalkAnimation.rainbow("KITTY ITEMS HAS STARTED");

  setTimeout(async () => {
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

    let logs = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Would you like to view the logs for all processes?`,
      default: true
    });

    if (logs.confirm) {
      console.log("\n");
      const ps = spawn("npx", ["pm2", "logs", "--no-daemon"], {
        shell: true,
        stdio: "inherit"
      });
      ps.stdout?.on("data", (data) => {
        console.log(data.toString().trim());
      });
      process.on("SIGINT", () => {
        process.exit(0);
      }); // CTRL+C
    } else {
      spinner.info(
        `View log output for all processes: ${chalk.cyanBright(
          `npx pm2 logs`
        )}${"\n"}`
      );
    }
    pm2.disconnect();
    spinner.stop();
  }, 3000);

  //////////////////////////////////////////////////////////////////
  // ------------- END PROCESS MANAGEMENT ENTRYPOINT ---------------
  //////////////////////////////////////////////////////////////////
});
