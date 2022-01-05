import path from "path";

import { 
	emulator,
	init,
	getAccountAddress,
	shallPass,
	mintFlow,
} from "flow-js-testing";

import { toUFix64 } from "../src/common";
import { 
	getKittyItemCount,
	mintKittyItem,
	getKittyItem,
	types,
	rarities,
} from "../src/kitty-items";
import {
	deployNFTStorefront,
	purchaseItemListing,
	createItemListing,
	removeItemListing,
	setupStorefrontOnAccount,
	getListingCount,
} from "../src/nft-storefront";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("NFT Storefront", () => {
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../");
		const port = 7003;
		await init(basePath, { port });
		await emulator.start(port, false);
		return await new Promise(r => setTimeout(r, 1000));
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		await emulator.stop();
		return await new Promise(r => setTimeout(r, 1000));
	});

	it("shall deploy NFTStorefront contract", async () => {
		await shallPass(deployNFTStorefront());
	});

	it("shall be able to create an empty Storefront", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");

		await shallPass(setupStorefrontOnAccount(Alice));
	});

	it("shall be able to create a listing", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);

		// Mint KittyItem for Alice's account
		await shallPass(mintKittyItem(Alice, types.fishbowl, rarities.blue));

		const itemID = 0;

		await shallPass(createItemListing(Alice, itemID, toUFix64(1.11)));
	});

	it("shall be able to accept a listing", async () => {
		// Setup
		await deployNFTStorefront();

		// Setup seller account
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
		await mintKittyItem(Alice, types.fishbowl, rarities.blue);

		const itemId = 0;

		// Setup buyer account
		const Bob = await getAccountAddress("Bob");
		await setupStorefrontOnAccount(Bob);

		await shallPass(mintFlow(Bob, toUFix64(100)));

		// Bob shall be able to buy from Alice
		const createItemListingTransactionResult = await shallPass(createItemListing(Alice, itemId, toUFix64(1.11)));

		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		await shallPass(purchaseItemListing(Bob, listingResourceID, Alice));

		const itemCount = await getKittyItemCount(Bob);
		expect(itemCount).toBe(1);

		const listingCount = await getListingCount(Alice);
		expect(listingCount).toBe(0);
	});

	it("shall be able to remove a listing", async () => {
		// Deploy contracts
		await shallPass(deployNFTStorefront());

		// Setup Alice account
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupStorefrontOnAccount(Alice));

		// Mint instruction shall pass
		await shallPass(mintKittyItem(Alice, types.fishbowl, rarities.blue));

		const itemId = 0;

		await getKittyItem(Alice, itemId);

		// Listing item for sale shall pass
		const createItemListingTransactionResult = await shallPass(createItemListing(Alice, itemId, toUFix64(1.11)));

		const listingAvailableEvent = createItemListingTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;

		// Alice shall be able to remove item from sale
		await shallPass(removeItemListing(Alice, listingResourceID));

		const listingCount = await getListingCount(Alice);
		expect(listingCount).toBe(0);
	});
});
