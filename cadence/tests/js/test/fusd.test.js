import path from "path";

import {
	emulator,
	init,
	getAccountAddress,
	shallPass,
	shallResolve,
	shallRevert,
	executeScript,
} from "flow-js-testing";

import { toUFix64, getAdminAddress } from "../src/common";
import { deployFUSD, setupFUSDOnAccount, getFUSDBalance, mintFUSD, sendFUSD } from "../src/FUSD";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("FUSD", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 7001;
		await init(basePath, { port });
		return emulator.start(port, false);
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		return emulator.stop();
	});

	it("should deploy FUSD", async () => {
		await shallResolve(deployFUSD);
	});

	it("shall not be able to withdraw more than the balance of the Vault", async () => {
		// Setup
		await deployFUSD();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(Admin);
		await setupFUSDOnAccount(Alice);

		// Set amounts
		const amount = toUFix64(2);
		const overflowAmount = toUFix64(3);

		// Mint instruction shall resolve
		await shallResolve(mintFUSD(Admin, amount));

		// Transaction shall revert
		await shallRevert(sendFUSD(Admin, Alice, overflowAmount));

		// Balances shall be intact
		await shallResolve(async () => {
			const aliceBalance = await getFUSDBalance(Alice);
			expect(aliceBalance).toBe(toUFix64(0));

			const AdminBalance = await getFUSDBalance(Admin);
			expect(AdminBalance).toBe(toUFix64(1000002));
		});
	});

	it("shall be able to withdraw and deposit tokens from a Vault", async () => {
		await deployFUSD();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupFUSDOnAccount(Admin);
		await setupFUSDOnAccount(Alice);

		const baseFUSDAmount = 1000000;
		const amount = 3;
		await shallPass(sendFUSD(Admin, Alice, toUFix64(amount)));

		await shallResolve(async () => {
			// Balances shall be updated
			const AdminBalance = await getFUSDBalance(Admin);
			expect(AdminBalance).toBe(toUFix64(baseFUSDAmount - amount));

			const aliceBalance = await getFUSDBalance(Alice);
			expect(aliceBalance).toBe(toUFix64(amount));
		});
	});
});
