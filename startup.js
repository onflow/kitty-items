const pm2 = require("pm2");
const inquirer = require("inquirer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs-extra")
const path = require("path");
const dotenv = require('dotenv')

async function isExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function writeFile(filePath, data) {
  try {
    const dirname = path.dirname(filePath);
    const exist = await isExists(dirname);
    if (!exist) {
      await fs.mkdir(dirname, { recursive: true });
    }

    await fs.writeFile(filePath, data, "utf8");
  } catch (err) {
    throw new Error(err);
  }
}

function convertToEnv (object) {
    let envFile = ''
    for (const key of Object.keys(object)) {
        envFile += `${key}=${object[key]}\n`
    }
    return envFile
}

const EMULATOR_DEPLOYMENT =
  "project deploy --network=emulator -f flow.json --update -o json";
const TESTNET_DEPLOYMENT =
  "project deploy --network=testnet -f flow.json -f flow.testnet.json --update -o json";

function envErr() {
  throw new Error(
    `Unknown or missing CHAIN_ENV environment variable.
         Please provide one of the following: "emulator", "testnet"`
  );
}

function adminError() {
  throw new Error(
    `Unknown or missing ADMIN_ADRESS environment variable.
      Please ctreate a testnet account and add your credentials to .env.tenstnet.local`
  );
}

function initializeStorefront(network) {
  if (!network) return envErr();
  return `transactions send --signer ${network}-account ./cadence/transactions/nftStorefront/setup_account.cdc`;
}

function initializeKittyItems(network) {
  if (!network) return envErr();
  return `transactions send --signer ${network}-account ./cadence/transactions/kittyItems/setup_account.cdc`;
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
  const {
    stdout: out,
    stderr: err
  } = await exec(`flow keys generate -o json`, { cwd: process.cwd() });

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
    pm2.start(config, function(err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
}

pm2.connect(true, async function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  let env = {};

  if (process.env.CHAIN_ENV === "emulator") {
    dotenv.config({
      path: requireEnv(process.env.CHAIN_ENV)
    });
    console.log("Starting Flow emulator...");
    await runProcess({
      name: "emulator",
      script: "flow",
      args: "emulator --dev-wallet=true",
      wait_ready: true
    });
  }

  if (process.env.CHAIN_ENV === "testnet") {
    let useExisting = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Use existing tesnet account?`
    });

    if (!useExisting.confirm) {
      console.log("Creating testnet new account keys...");

      const result = await generateKeys();

      console.log(`
      Please store the following keys in a safe place:
      
      Public key: ${result.public}
      Private key: ${result.private}

      What now?

      1. Create a new account using the testnet faucet by visiting: 
      https://testnet-faucet.onflow.org/

      2. Copy the new account address from the faucet, and paste it below 👇
      (don't exit this terminal)

      `)

      const testnet = await inquirer.prompt([
        {
          type: "input",
          name: "account",
          message: "Enter your new testnet account address"
        }
      ]);

      result.account = testnet.account;

      writeFile(`testnet-credentials-${testnet.account}.json`, JSON.stringify(result));

      const testnetEnvFile = fs.readFileSync(".env.testnet.template", "utf8");
      const buf = Buffer.from(testnetEnvFile)
      const parsed = dotenv.parse(buf);

      env = {
        ADMIN_ADDRESS: testnet.account,
        FLOW_PRIVATE_KEY: result.private,
        FLOW_PUBLIC_KEY: result.public
      };

      writeFile(".env.testnet.local", `${convertToEnv({ ...parsed, ...env })}`);

      console.log(` 
        Testnet envronment config was written to: .env.testnet.local
      `);
    }
  }

  require('dotenv').config({
    path: requireEnv(process.env.CHAIN_ENV)
  })

  if (!process.env.ADMIN_ADDRESS) adminError()
  
  console.log("Starting API & event worker...");
  await runProcess({
    name: "api",
    cwd: "./api",
    script: "npm",
    args: "run dev",
    watch: false,
    wait_ready: true,
  });

  console.log("Starting web app...");
  await runProcess({
    name: "web",
    cwd: "./web",
    script: "npm",
    args: "run dev",
    watch: false,
    wait_ready: true,
    autorestart: false
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
      watch: ["cadence"],
    });

    console.log("Initializing admin account...");

    await runProcess({
      name: "init kittyitems admin",
      script: "flow",
      args: initializeKittyItems(process.env.CHAIN_ENV),
      autorestart: false,
      wait_ready: true,
      kill_timeout: 5000,
    });

    await runProcess({
      name: "init storefront admin",
      script: "flow",
      args: initializeStorefront(process.env.CHAIN_ENV),
      autorestart: false,
      wait_ready: true,
      kill_timeout: 5000,
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
