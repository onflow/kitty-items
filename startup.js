import pm2 from "pm2";
import inquirer from "inquirer";
import util from "util";
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import { exec as exe } from "child_process";
import ora from 'ora';

const exec = util.promisify(exe);

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
      Please create a testnet account and add your credentials to .env.tenstnet.local`
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
const spinner = ora()
spinner.color = 'green'

pm2.connect(true, async function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  let env = {};

  if (process.env.CHAIN_ENV === "emulator") {

    spinner.start('Emulating Flow Network')

    await runProcess({
      name: "emulator",
      script: "flow",
      args: "emulator --dev-wallet=true",
      wait_ready: true
    });

    spinner.succeed('Emulator started');
  }

  if (process.env.CHAIN_ENV === "testnet") {
    let useExisting = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Use existing testnet account?`
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
      https://testnet-faucet.onflow.org/?key=${result.public}&source=ki

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

      await writeFile(`testnet-credentials-${testnet.account}.json`, JSON.stringify(result));

      const testnetEnvFile = fs.readFileSync(".env.testnet.template", "utf8");
      const buf = Buffer.from(testnetEnvFile)
      const parsed = dotenv.parse(buf);

      env = {
        ADMIN_ADDRESS: testnet.account,
        FLOW_PRIVATE_KEY: result.private,
        FLOW_PUBLIC_KEY: result.public
      };

      await writeFile(".env.testnet.local", `${convertToEnv({ ...parsed, ...env })}`);

      console.log(` 
        Testnet envronment config was written to: .env.testnet.local
      `);
    }
  }

  dotenv.config({
    path: requireEnv(process.env.CHAIN_ENV)
  })

  if (!process.env.ADMIN_ADDRESS) adminError()
  
  spinner.start('Starting API server')

  await runProcess({
    name: "api",
    cwd: "./api",
    script: "npm",
    args: "run dev",
    watch: false,
    wait_ready: true,
  });

  spinner.succeed('API server started')

  spinner.start('Starting storefront web app')

  await runProcess({
    name: "web",
    cwd: "./web",
    script: "npm",
    args: "run dev",
    watch: false,
    wait_ready: true,
    autorestart: false
  });

  spinner.succeed('Storefront web app started')

  spinner.start('Deploying contracts')

  await runProcess({
    name: "contracts",
    script: "flow",
    args: deploy(process.env.CHAIN_ENV),
    autorestart: false,
    wait_ready: true,
    watch: ["cadence"],
  });

  spinner.succeed('Contracts deployed')

  spinner.start("Initializing admin account");

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

  spinner.succeed('Admin account initialized')

  console.log("Deployment complete!");

  console.log(
    `
      😸 Kitty Items has started! 😸
      
      Visit: http://localhost:3001

      Run: 
        - npx pm2 logs to see log output.
        - npx pm2 list to see processes.
        - npx pm2 monit to see process monitoring.
        - npx pm2 delete all --force to stop and delete processes. 
    `
  );

  pm2.disconnect();
});
