import path from "path";
import { emulator, init, getAccountAddress, shallPass } from "flow-js-testing";

import { toUFix64 } from "../src/common";
import { mintKibble } from "../src/kibble";
import { getCollectionLength, mintKittyItem, typeID1337 } from "../src/kitty-items";
import {
	buyItem,
	deployMarketplace,
	listItemForSale,
	removeItem,
	setupMarketplaceOnAccount,
	getMarketCollectionLength,
} from "../src/kitty-items-marketplace";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("Kitty Items Marketplace", () => {
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 8085;
		init(basePath, port);
		return emulator.start(port, false);
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		return emulator.stop();
	});

	it("shall deploy KittyItemsMarket contract", async () => {
		await shallPass(deployMarketplace());
	});

	it("shall be able to create an empty Collection", async () => {
		// Setup
		await deployMarketplace();
		const Alice = await getAccountAddress("Alice");

		await shallPass(setupMarketplaceOnAccount(Alice));
	});

	it("shall be able to create a sale offer and list it", async () => {
		// Setup
		await deployMarketplace();
		const Alice = await getAccountAddress("Alice");
		await setupMarketplaceOnAccount(Alice);

		// Mint KittyItem for Alice's account
		await shallPass(mintKittyItem(typeID1337, Alice));

		await shallPass(listItemForSale(Alice, 0, toUFix64(1.11)));
	});

	it("shall be able to accept a sale offer", async () => {
		// Setup
		await deployMarketplace();

		// Setup seller account
		const Alice = await getAccountAddress("Alice");
		await setupMarketplaceOnAccount(Alice);
		await mintKittyItem(typeID1337, Alice);

		// Setup buyer account
		const Bob = await getAccountAddress("Bob");
		await setupMarketplaceOnAccount(Bob);

		await shallPass(mintKibble(Bob, toUFix64(100)));

		// Bob shall be able to buy from Alice
		await shallPass(listItemForSale(Alice, 0, toUFix64(1.11)));
		await shallPass(buyItem(Bob, 0, Alice));

		const length = await getCollectionLength(Bob);
		expect(length).toBe(1);

		const itemsListed = await getMarketCollectionLength(Alice);
		expect(itemsListed).toBe(0);
	});

	it("shall be able to remove a sale offer", async () => {
		// Deploy contracts
		await shallPass(deployMarketplace());

		// Setup Alice account
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupMarketplaceOnAccount(Alice));

		// Mint instruction shall pass
		await shallPass(mintKittyItem(typeID1337, Alice));

		// Listing item for sale shall pass
		await shallPass(listItemForSale(Alice, 0, toUFix64(1.11)));

		// Alice shall be able to remove item from sale
		await shallPass(removeItem(Alice, 0));
	});
});
