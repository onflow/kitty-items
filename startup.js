const pm2 = require("pm2");
const inquirer = require("inquirer");

const EMULATOR_DEPLOYMENT =
  "project deploy --network=emulator -f flow.json --update";
const TESTNET_DEPLOYMENT =
  "project deploy --network=testnet -f flow.json -f flow.testnet --update";

function envErr() {
  throw new Error(
    `Unknown or missing CHAIN_ENV environment variable.
         Please provide one of the following: "emulator", "testnet"`
  );
}

function initializeStorefront(network) {
  if (!network) return envErr()
  return `transactions send --signer ${network}-account ./cadence/transactions/nftStorefront/setup_account.cdc`
}

function initializeKittyItems(network) {
  if (!network) return envErr()
  return `transactions send --signer ${network}-account ./cadence/transactions/kittyItems/setup_account.cdc`
}

function deploy(env) {
  switch (env) {
    case "emulator":
      return EMULATOR_DEPLOYMENT;
    case "testnet":
      return TESTNET_DEPLOYMENT;
    default:
      envErr();
  }
}

function requireEnv(env) {
  switch (env) {
    case "emulator":
      return ".env.local";
    case "testnet":
      return ".env.testnet";
    default:
      envErr();
  }
}

async function initializeAccount(address, opts = {}) {}

require("dotenv").config({
  path: requireEnv(process.env.CHAIN_ENV)
});

async function runProcess(config) {
  return new Promise((resolve, reject) => {
    pm2.start(config, function (err, apps) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(apps);
    });
  });
}

pm2.connect(true, async function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  if (process.env.CHAIN_ENV === "emulator") {
    console.log("Starting Flow emulator...");
    await runProcess({
      name: "emulator",
      script: "flow",
      args: "emulator --dev-wallet=true",
      wait_ready: true
    });
  }

  console.log("Starting API & event worker...");
  await runProcess({
    name: "api",
    cwd: "./api",
    script: "npm",
    args: "run dev",
    watch: true,
    ignore_watch: ["node_modules"],
    wait_ready: true
  });

  console.log("Starting web app...");
  await runProcess({
    name: "web",
    cwd: "./web",
    script: "npm",
    args: "run dev",
    watch: true,
    ignore_watch: ["node_modules", ".next"],
    wait_ready: true
  });

  let answer = await inquirer.prompt({
    type: "confirm",
    name: "confirm",
    message: `Deploy contracts to ${process.env.CHAIN_ENV}?`
  });

  if (answer.confirm) {

    console.log("Deploying contracts...");

    await runProcess({
      name: "contracts",
      script: "flow",
      args: deploy(process.env.CHAIN_ENV),
      autorestart: false,
      wait_ready: true,
      watch: ["cadence"]
    });

    console.log("Initializing admin account...");

    await runProcess({
      name: "init kittyitems admin",
      script: "flow",
      args: initializeKittyItems(process.env.CHAIN_ENV),
      autorestart: false,
      wait_ready: true,
    })

    await runProcess({
      name: "init storefront admin",
      script: "flow",
      args: initializeStorefront(process.env.CHAIN_ENV),
      autorestart: false,
      wait_ready: true,
    });

    console.log("Deployment complete!");

  } else { 
    console.log("Contracts were not deployed. See README for instructions.");  
  }

  console.log(
    `
      😸 Kitty Items has started! 😸

      Run: 
        - npx pm2 logs to see log output.
        - npx pm2 list to see processes.
        - npx pm2 monit to see process monitoring.
        - npx pm2 delete all --force to stop and delete processes. 
    `
  );

  pm2.disconnect();
});
