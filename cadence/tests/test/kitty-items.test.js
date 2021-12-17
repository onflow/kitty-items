import path from "path";

import { emulator, init, getAccountAddress, shallPass, shallResolve, shallRevert } from "flow-js-testing";

import { getKittyAdminAddress } from "../src/common";
import {
	deployKittyItems,
	getKittyItem,
	getKittyItemCount,
	getKittyItemSupply,
	mintKittyItem,
	setupKittyItemsOnAccount,
	transferKittyItem,
	typeID1,
} from "../src/kitty-items";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("Kitty Items", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 7002;
		await init(basePath, { port });
		return emulator.start(port, false);
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		return emulator.stop();
	});

	it("shall deploy KittyItems contract", async () => {
		await deployKittyItems();
	});

	it("supply shall be 0 after contract is deployed", async () => {
		// Setup
		await deployKittyItems();
		const KittyAdmin = await getKittyAdminAddress();
		await shallPass(setupKittyItemsOnAccount(KittyAdmin));

		await shallResolve(async () => {
			const supply = await getKittyItemSupply();
			expect(supply).toBe(0);
		});
	});

	it("shall be able to mint a kittyItems", async () => {
		// Setup
		await deployKittyItems();
		const Alice = await getAccountAddress("Alice");
		await setupKittyItemsOnAccount(Alice);
		const itemIdToMint = typeID1;

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintKittyItem(itemIdToMint, Alice));
	});

	it("shall be able to create a new empty NFT Collection", async () => {
		// Setup
		await deployKittyItems();
		const Alice = await getAccountAddress("Alice");
		await setupKittyItemsOnAccount(Alice);

		// shall be able te read Alice collection and ensure it's empty
		await shallResolve(async () => {
			const itemCount = await getKittyItemCount(Alice);
			expect(itemCount).toBe(0);
		});
	});

	it("shall not be able to withdraw an NFT that doesn't exist in a collection", async () => {
		// Setup
		await deployKittyItems();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupKittyItemsOnAccount(Alice);
		await setupKittyItemsOnAccount(Bob);

		// Transfer transaction shall fail for non-existent item
		await shallRevert(transferKittyItem(Alice, Bob, 1337));
	});

	it("shall be able to withdraw an NFT and deposit to another accounts collection", async () => {
		await deployKittyItems();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupKittyItemsOnAccount(Alice);
		await setupKittyItemsOnAccount(Bob);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintKittyItem(typeID1, Alice));

		// Transfer transaction shall pass
		await shallPass(transferKittyItem(Alice, Bob, 0));
	});
});
