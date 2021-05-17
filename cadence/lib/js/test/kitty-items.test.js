import path from "path";
import { init } from "flow-js-testing/dist";

import { emulator } from "../emulator";
import { deployKittyItems, getKittyItemSupply, setupKittyItemsOnAccount } from "../src/kitty-items";
import { getRegistry } from "../src/common";

describe("Kitty Items", () => {
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

	test("deploy KittyItems contract", async () => {
		await expect(deployKittyItems()).resolves.not.toThrow();
	});

	test("supply should be 0 after contract is deployed", async () => {
		const Registry = await getRegistry();
		await deployKittyItems();
		await setupKittyItemsOnAccount(Registry);

		const supply = await getKittyItemSupply();
		console.log(supply);
		expect(supply).toBe(0);
	});

	test("should be able to create a new empty NFT Collection", async () => {
		await deployKittyItems();
	});

	test("should be able to mint a kittyItems", async () => {});
	test("", async () => {});
	test("", async () => {});
	test("", async () => {});
});
