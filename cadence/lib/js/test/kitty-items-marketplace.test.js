import path from "path";
import { init, getAccountAddress } from "flow-js-testing/dist";

import { emulator } from "../emulator";
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

jest.setTimeout(30000);

describe("Kitty Items Marketplace", () => {
	beforeEach(async (done) => {
		init(path.resolve(__dirname, "../../../"));
		await emulator.start(false);
		done();
	});

	afterEach(async (done) => {
		await emulator.stop();
		done();
	});

	test("should deploy KittyItemsMarket contract", async () => {
		await expect(deployMarketplace()).resolves.not.toThrow();
	});
	test("should be able to create an empty Collection", async () => {
		await deployMarketplace();

		const Alice = await getAccountAddress("Alice");
		await expect(setupMarketplaceOnAccount(Alice)).resolves.not.toThrow();
	});
	test("should be able to create a sale offer and list it", async () => {
		await deployMarketplace();

		const Alice = await getAccountAddress("Alice");
		await setupMarketplaceOnAccount(Alice);

		await mintKittyItem(typeID1337, Alice);

		const price = toUFix64(1.11);
		await expect(listItemForSale(Alice, 0, price)).resolves.not.toThrow();
	});
	test("should be able to accept a sale offer", async () => {
		await deployMarketplace();

		// Setup seller account
		const Alice = await getAccountAddress("Alice");
		await setupMarketplaceOnAccount(Alice);
		await mintKittyItem(typeID1337, Alice);
		await listItemForSale(Alice, 0, toUFix64(1.11));

		// Setup buyer account
		const Bob = await getAccountAddress("Bob");
		await setupMarketplaceOnAccount(Bob);
		await mintKibble(Bob, toUFix64(100));

		await expect(buyItem(Bob, 0, Alice)).resolves.not.toThrow();

		const length = await getCollectionLength(Bob);
		expect(length).toBe(1);

		const itemsListed = await getMarketCollectionLength(Alice);
		expect(itemsListed).toBe(0);
	});
	test("should be able to remove a sale offer", async () => {
		await deployMarketplace();

		// Setup owner account
		const Alice = await getAccountAddress("Alice");
		await setupMarketplaceOnAccount(Alice);
		await mintKittyItem(typeID1337, Alice);
		await listItemForSale(Alice, 0, toUFix64(1.11));

		await expect(removeItem(Alice, 0)).resolves.not.toThrow();
	});
});
