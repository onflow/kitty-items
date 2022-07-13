import path from "path";

import { 
	emulator,
	init,
	getAccountAddress,
	shallPass,
	shallResolve,
	shallRevert,
} from "@onflow/flow-js-testing";

import { getKittyAdminAddress } from "../src/common";
import {
	deployKittyItems,
	getKittyItemCount,
	getKittyItemSupply,
	mintKittyItem,
	setupKittyItemsOnAccount,
	transferKittyItem,
	types,
	rarities,
} from "../src/kitty-items";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("Kitty Items", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../");
		await init(basePath);
		await emulator.start();
		return await new Promise(r => setTimeout(r, 1000));
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		await emulator.stop();
		return await new Promise(r => setTimeout(r, 1000));
	});

	it("should deploy KittyItems contract", async () => {
		await shallPass(deployKittyItems());
	});

	it("supply should be 0 after contract is deployed", async () => {
		// Setup
		await deployKittyItems();
		const KittyAdmin = await getKittyAdminAddress();
		await shallPass(setupKittyItemsOnAccount(KittyAdmin));

		const [supply] = await shallResolve(getKittyItemSupply())
		expect(supply).toBe(0);
	});

	it("should be able to mint a kitty item", async () => {
		// Setup
		await deployKittyItems();
		const Alice = await getAccountAddress("Alice");
		await setupKittyItemsOnAccount(Alice);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintKittyItem(Alice, types.fishbowl, rarities.blue));
	});

	it("should be able to create a new empty NFT Collection", async () => {
		// Setup
		await deployKittyItems();
		const Alice = await getAccountAddress("Alice");
		await setupKittyItemsOnAccount(Alice);

		// shall be able te read Alice collection and ensure it's empty
		const [itemCount] = await shallResolve(getKittyItemCount(Alice))
		expect(itemCount).toBe(0);
	});

	it("should not be able to withdraw an NFT that doesn't exist in a collection", async () => {
		// Setup
		await deployKittyItems();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupKittyItemsOnAccount(Alice);
		await setupKittyItemsOnAccount(Bob);

		// Transfer transaction shall fail for non-existent item
		await shallRevert(transferKittyItem(Alice, Bob, 1337));
	});

	it("should be able to withdraw an NFT and deposit to another accounts collection", async () => {
		await deployKittyItems();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupKittyItemsOnAccount(Alice);
		await setupKittyItemsOnAccount(Bob);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintKittyItem(Alice, types.fishbowl, rarities.blue));

		// Transfer transaction shall pass
		await shallPass(transferKittyItem(Alice, Bob, 0));
	});
});
