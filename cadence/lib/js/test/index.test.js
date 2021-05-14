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

import { Address, UFix64 } from "@onflow/types";
import { emulator } from "../emulator";

const UFIX64_PRECISION = 8;
const UFIX64_ZERO = (0).toFixed(UFIX64_PRECISION);

const toUFix64 = (value) => value.toFixed(UFIX64_PRECISION);

const deployKibble = async () => {
	const Registry = await getAccountAddress("Registry");
	await mintFlow(Registry, "10.0");

	await deployContractByName({ to: Registry, name: "FungibleToken" });

	const addressMap = { FungibleToken: Registry };
	await deployContractByName({ to: Registry, name: "Kibble", addressMap });
};
const setupAccount = async (address) => {
	const FungibleToken = await getContractAddress("FungibleToken");
	const Kibble = await getContractAddress("Kibble");

	const name = "kibble/setup_account";
	const addressMap = { FungibleToken, Kibble };

	const code = await getTransactionCode({ name, addressMap });
	const signers = [address];

	return sendTransaction({ code, signers });
};
const getKibbleBalance = async (accountAddress) => {
	const Registry = await getAccountAddress("Registry");

	const name = "kibble/get_balance";
	const addressMap = {
		FungibleToken: Registry,
		Kibble: Registry,
	};

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
const mintKibble = async (recipient, amount) => {
	const Registry = await getAccountAddress("Registry");

	const name = "kibble/mint_tokens";
	const addressMap = {
		FungibleToken: Registry,
		Kibble: Registry,
	};

	const code = await getTransactionCode({ name, addressMap });
	const signers = [Registry];
	const args = [
		[recipient, Address],
		[amount, UFix64],
	];

	return sendTransaction({
		code,
		signers,
		args,
	});
};
const transferKibble = async (from, to, amount) => {
	const Registry = await getAccountAddress("Registry");

	const name = "kibble/transfer_tokens";
	const addressMap = {
		FungibleToken: Registry,
		Kibble: Registry,
	};

	const code = await getTransactionCode({ name, addressMap });
	const signers = [from];
	const args = [
		[amount, UFix64],
		[to, Address],
	];

	return sendTransaction({
		code,
		signers,
		args,
	});
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

	test("should have initialized supply field correctly", async () => {
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
		const Alice = await getAccountAddress("Alice");

		try {
			const { status } = await setupAccount(Alice);
			expect(status).toBe(4);
		} catch (e) {
			console.error(e);
		}

		const supply = await getKibbleSupply();
		const aliceBalance = await getKibbleBalance(Alice);

		expect(supply).toBe(UFIX64_ZERO);
		expect(aliceBalance).toBe(UFIX64_ZERO);
	});

	test("shouldn't be able to mint zero tokens", async () => {
		await deployKibble();
		const Alice = await getAccountAddress("Alice");
		await setupAccount(Alice);

		try {
			await mintKibble(Alice, toUFix64(0));
		} catch (e) {
			expect(e).not.toBe(null);
		}
	});

	test("Should mint tokens, deposit, and update balance and total supply", async () => {
		await deployKibble();
		const Alice = await getAccountAddress("Alice");
		await setupAccount(Alice);

		const amount = toUFix64(50);

		try {
			const { status } = await mintKibble(Alice, amount);
			expect(status).toBe(4);
		} catch (e) {
			console.error(e);
		}

		const balance = await getKibbleBalance(Alice);
		expect(balance).toBe(amount);

		const supply = await getKibbleSupply();
		expect(supply).toBe(amount);
	});

	test("shouldn't be able to withdraw more than the balance of the Vault", async () => {
		await deployKibble();
		const Registry = await getAccountAddress("Registry");
		const Alice = await getAccountAddress("Alice");
		await setupAccount(Registry);
		await setupAccount(Alice);

		const amount = toUFix64(1000);
		await mintKibble(Registry, amount);

		const overflowAmount = toUFix64(30000);

		try {
			await transferKibble(Registry, Alice, overflowAmount);
		} catch (e) {
			expect(e).not.toBe(null);
		}

		const aliceBalance = await getKibbleBalance(Alice);
		expect(aliceBalance).toBe(UFIX64_ZERO);

		const registryBalance = await getKibbleBalance(Registry);
		expect(registryBalance).toBe(amount);
	}, 10000);
});

// Single Tests
describe("Kibble", () => {
	beforeEach(() => {
		init(path.resolve(__dirname, "../../../"));
	});

	test("deploy", async () => {
		await deployKibble();
	});

	test("get kibble supply", async () => {
		const t = await getKibbleSupply();
		console.log({ t });
	});

	test("setup alice", async () => {
		const Alice = await getAccountAddress("Alice");
		await setupAccount(Alice);
	});

	test("get balance", async () => {
		const Alice = await getAccountAddress("Alice");
		const t = await getKibbleBalance(Alice);
		console.log({ t });
	});
});

/*
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


 */
