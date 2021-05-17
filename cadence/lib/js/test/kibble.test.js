import path from "path";
import { init, getAccountAddress } from "flow-js-testing/dist";

import { emulator } from "../emulator";
import {
	deployKibble,
	setupKibbleOnAccount,
	getKibbleBalance,
	getKibbleSupply,
	mintKibble,
	transferKibble,
} from "../src/kibble";

import { toUFix64, getRegistry } from "../src/common";

// We need to set timeout for a higher number, cause some transactions might take up some time
jest.setTimeout(10000);

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

		try {
			const supply = await getKibbleSupply();
			expect(supply).toBe(toUFix64(0));
		} catch (e) {
			console.error(e);
		}
	});

	test("should be able to create empty Vault that doesn't affect supply", async () => {
		await deployKibble();
		const Alice = await getAccountAddress("Alice");

		try {
			const { status } = await setupKibbleOnAccount(Alice);
			expect(status).toBe(4);
		} catch (e) {
			console.error(e);
		}

		const supply = await getKibbleSupply();
		const aliceBalance = await getKibbleBalance(Alice);

		expect(supply).toBe(toUFix64(0));
		expect(aliceBalance).toBe(toUFix64(0));
	});

	test("shouldn't be able to mint zero tokens", async () => {
		await deployKibble();
		const Alice = await getAccountAddress("Alice");
		await setupKibbleOnAccount(Alice);

		try {
			await mintKibble(Alice, toUFix64(0));
		} catch (e) {
			expect(e).not.toBe(null);
		}
	});

	test("Should mint tokens, deposit, and update balance and total supply", async () => {
		await deployKibble();
		const Alice = await getAccountAddress("Alice");
		await setupKibbleOnAccount(Alice);

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
		const Registry = await getRegistry();
		const Alice = await getAccountAddress("Alice");
		await setupKibbleOnAccount(Registry);
		await setupKibbleOnAccount(Alice);

		const amount = toUFix64(1000);
		await mintKibble(Registry, amount);

		const overflowAmount = toUFix64(30000);

		try {
			await transferKibble(Registry, Alice, overflowAmount);
		} catch (e) {
			expect(e).not.toBe(null);
		}

		const aliceBalance = await getKibbleBalance(Alice);
		expect(aliceBalance).toBe(toUFix64(0));

		const registryBalance = await getKibbleBalance(Registry);
		expect(registryBalance).toBe(amount);
	});

	test("should be able to withdraw and deposit tokens from a Vault", async () => {
		await deployKibble();
		const Registry = await getRegistry();
		const Alice = await getAccountAddress("Alice");
		await setupKibbleOnAccount(Registry);
		await setupKibbleOnAccount(Alice);
		await mintKibble(Registry, toUFix64(1000));

		try {
			const { status } = await transferKibble(Registry, Alice, toUFix64(300));
			expect(status).toBe(4);
		} catch (e) {
			console.error(e);
		}

		const registryBalance = await getKibbleBalance(Registry);
		expect(registryBalance).toBe(toUFix64(700));

		const aliceBalance = await getKibbleBalance(Alice);
		expect(aliceBalance).toBe(toUFix64(300));

		const supply = await getKibbleSupply();
		expect(supply).toBe(toUFix64(1000));
	});
});
