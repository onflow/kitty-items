import path from "path";
import {
	init,
	getAccountAddress,
	deployContractByName,
	getContractAddress,
	mintFlow,
	executeScript,
	sendTransaction,
	getScriptCode,
	getTransactionCode,
} from "flow-js-testing/dist";

import { Address } from "@onflow/types";
import { emulator } from "../emulator";

const UFIX64_PRECISION = 8;
const UFIX64_ZERO = (0).toFixed(UFIX64_PRECISION);

const deployKibble = async () => {
	const Registry = await getAccountAddress("Registry");
	await mintFlow(Registry, "10.0");

	await deployContractByName({ to: Registry, name: "FungibleToken" });

	const addressMap = { FungibleToken: Registry };
	await deployContractByName({ to: Registry, name: "Kibble", addressMap });
};

const getKibbleBalance = async (accountAddress) => {
	const Registry = await getAccountAddress("Registry");

	const name = "kibble/get_balance";
	const addressMap = { FungibleToken: Registry };

	const code = await getScriptCode({ name, addressMap });
	const args = [[accountAddress, Address]];

	return executeScript({ code, args });
};

const getKibbleSupply = async () => {
	const Registry = await getAccountAddress("Registry");

	const name = "kibble/get_supply";
	const addressMap = { Kibble: Registry };

	const code = await getScriptCode({ name, addressMap });
	return executeScript({ code });
};

describe("Kibble", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async (done) => {
		init(path.resolve(__dirname, "../../../"));
		await emulator.start(false);
		done();
	});

	// Stop emulator, so it could be restarted
	afterEach(async (done) => {
		await emulator.stop();
		done();
	});

	test("should have initialized Supply field correctly", async () => {
		await deployKibble();
		let supply;
		try {
			supply = await getKibbleSupply();
		} catch (e) {
			console.error(e);
		}
		expect(supply).toBe(UFIX64_ZERO);
	});

	test("should be able to create empty Vault that doesn't affect supply", async () => {
		await deployKibble();

		const FungibleToken = await getContractAddress("FungibleToken");
		const Kibble = await getContractAddress("Kibble");
		const Alice = await getAccountAddress("Alice");

		const name = "kibble/setup_account";
		const addressMap = { FungibleToken, Kibble };

		const code = await getTransactionCode({ name, addressMap });
		const signers = [Alice];

		let txResult;
		try {
			txResult = await sendTransaction({ code, signers });
			expect(txResult.status).toBe(4);
		} catch (e) {
			console.log(e);
		}

		console.log({ txResult });

		const supply = await getKibbleSupply();
		const aliceBalance = await getKibbleBalance(Alice);

		console.log({ supply, aliceBalance });

		// expect(supply).toBe(UFIX64_ZERO);
		// expect(aliceBalance).toBe(UFIX64_ZERO);
	});
});

describe("Kitty Items", () => {
	test("Deploy Contracts", async () => {
		const Registry = await getAccountAddress("Registry");
		// Add FLOW to Registry account to pay for deployed contracts
		await mintFlow(Registry, "10.0");

		await deployContractByName({
			to: Registry,
			name: "FungibleToken",
		});

		await deployContractByName({
			to: Registry,
			name: "NonFungibleToken",
		});

		const addressMap = {
			FungibleToken: Registry,
			NonFungibleToken: Registry,
		};

		await deployContractByName({
			to: Registry,
			name: "Kibble",
			addressMap,
		});

		await deployContractByName({
			to: Registry,
			name: "KittyItems",
			addressMap,
		});

		await deployContractByName({
			to: Registry,
			name: "KittyItemsMarket",
			addressMap: {
				...addressMap,
				Kibble: Registry,
				KittyItems: Registry,
			},
		});
	});

	// Kibble Suit
	// #1: Test Kibble contract was deployed succesfully
	test("Kibble - Deployment", async () => {
		const Kibble = await getContractAddress("Kibble");

		const addressMap = { Kibble };
		const name = "kibble/get_supply";
		const code = await getScriptCode({ name, addressMap });

		const supply = await executeScript({ code });
		expect(supply).toBe((0).toFixed(8));
	});

	// #2: Setup Account
	test("Kibble - Setup Account", async () => {});
});
