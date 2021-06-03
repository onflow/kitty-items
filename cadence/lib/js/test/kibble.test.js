import path from "path";
import { emulator, init, getAccountAddress, shallPass, shallResolve, shallRevert } from "flow-js-testing";

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
jest.setTimeout(30000);

describe("Kibble", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async (done) => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 8080;
		init(basePath, port);
		await emulator.start(port, false);
		done();
	});

	// Stop emulator, so it could be restarted
	afterEach(async (done) => {
		await emulator.stop();
		done();
	});

	test("should have initialized supply field correctly", async () => {
		// Deploy contract
		await shallPass(deployKibble());

		await shallResolve(async () => {
			const supply = await getKibbleSupply();
			expect(supply).toBe(toUFix64(0));
		});
	});

	test("should be able to create empty Vault that doesn't affect supply", async () => {
		// Setup
		await deployKibble();
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupKibbleOnAccount(Alice));

		await shallResolve(async () => {
			const supply = await getKibbleSupply();
			const aliceBalance = await getKibbleBalance(Alice);
			expect(supply).toBe(toUFix64(0));
			expect(aliceBalance).toBe(toUFix64(0));
		});
	});

	test("should not be able to mint zero tokens", async () => {
		// Setup
		await deployKibble();
		const Alice = await getAccountAddress("Alice");
		await setupKibbleOnAccount(Alice);

		// Mint instruction with amount equal to 0 shall be reverted
		const result = await shallRevert(mintKibble(Alice, toUFix64(0)));
	});

	test("Should mint tokens, deposit, and update balance and total supply", async () => {
		// Setup
		await deployKibble();
		const Alice = await getAccountAddress("Alice");
		await setupKibbleOnAccount(Alice);
		const amount = toUFix64(50);

		// Mint Kibble tokens for Alice
		await shallPass(mintKibble(Alice, amount));

		// Check Kibble total supply and Alice's balance
		await shallResolve(async () => {
			// Check Alice balance to equal amount
			const balance = await getKibbleBalance(Alice);
			expect(balance).toBe(amount);

			// Check Kibble supply to equal amount
			const supply = await getKibbleSupply();
			expect(supply).toBe(amount);
		});
	});

	test("should not be able to withdraw more than the balance of the Vault", async () => {
		// Setup
		await deployKibble();
		const Registry = await getRegistry();
		const Alice = await getAccountAddress("Alice");
		await setupKibbleOnAccount(Registry);
		await setupKibbleOnAccount(Alice);

		// Set amounts
		const amount = toUFix64(1000);
		const overflowAmount = toUFix64(30000);

		// Mint instruction shall resolve
		await shallResolve(mintKibble(Registry, amount));

		// Transaction shall revert
		await shallRevert(transferKibble(Registry, Alice, overflowAmount));

		// Balances shall be intact
		await shallResolve(async () => {
			const aliceBalance = await getKibbleBalance(Alice);
			expect(aliceBalance).toBe(toUFix64(0));

			const registryBalance = await getKibbleBalance(Registry);
			expect(registryBalance).toBe(amount);
		});
	});

	test("should be able to withdraw and deposit tokens from a Vault", async () => {
		await deployKibble();
		const Registry = await getRegistry();
		const Alice = await getAccountAddress("Alice");
		await setupKibbleOnAccount(Registry);
		await setupKibbleOnAccount(Alice);
		await mintKibble(Registry, toUFix64(1000));

		await shallPass(transferKibble(Registry, Alice, toUFix64(300)));

		await shallResolve(async () => {
			// Balances shall be updated
			const registryBalance = await getKibbleBalance(Registry);
			expect(registryBalance).toBe(toUFix64(700));

			const aliceBalance = await getKibbleBalance(Alice);
			expect(aliceBalance).toBe(toUFix64(300));

			const supply = await getKibbleSupply();
			expect(supply).toBe(toUFix64(1000));
		});
	});
});
