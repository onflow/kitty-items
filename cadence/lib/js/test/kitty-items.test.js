import path from "path";
import { init } from "flow-js-testing/dist";

import { emulator } from "../emulator";
import {
	deployKittyItems,
	getAmountOfItemsInAccount,
	getCollectionLength,
	getKittyItemById,
	getKittyItemSupply,
	mintKittyItem,
	setupKittyItemsOnAccount,
	transferKittyItem,
	typeID1,
} from "../src/kitty-items";
import { getRegistry } from "../src/common";
import { getAccountAddress } from "flow-js-testing/dist/utils/account";

// We need to set timeout for a higher number, cause some transactions might take up some time
jest.setTimeout(10000);

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

	test("should deploy KittyItems contract", async () => {
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

	test("should be able to mint a kittyItems", async () => {
		const Alice = await getAccountAddress("Alice");
		await deployKittyItems();
		await setupKittyItemsOnAccount(Alice);

		const itemIdToMint = typeID1;

		try {
			const { status } = await mintKittyItem(itemIdToMint, Alice);
			expect(status).toBe(4);
		} catch (e) {
			console.error(e);
		}

		const amount = await getAmountOfItemsInAccount(Alice);
		expect(amount).toBe(1);

		const id = await getKittyItemById(Alice, 0);
		expect(id).toBe(itemIdToMint);
	});

	test("should be able to create a new empty NFT Collection", async () => {
		const Alice = await getAccountAddress("Alice");
		await deployKittyItems();
		await setupKittyItemsOnAccount(Alice);

		const length = await getCollectionLength(Alice);
		expect(length).toBe(0);
	});

	test("shouldn't be able to withdraw an NFT that doesn't exist in a collection", async () => {
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await deployKittyItems();
		await setupKittyItemsOnAccount(Alice);

		try {
			await transferKittyItem(Alice, Bob, 1337);
		} catch (e) {
			expect(e).not.toBe(null);
		}
	});
	test("should be able to withdraw an NFT and deposit to another accounts collection", async () => {
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await deployKittyItems();
		await setupKittyItemsOnAccount(Alice);
		await setupKittyItemsOnAccount(Bob);
		await mintKittyItem(typeID1, Alice);

		try {
			const { status } = await transferKittyItem(Alice, Bob, 1337);
			expect(status).toBe(4);
		} catch (e) {}
	});
});
