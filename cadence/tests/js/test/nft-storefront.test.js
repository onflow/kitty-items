import path from "path";

import { emulator, init, getAccountAddress, shallPass } from "flow-js-testing";

import { toUFix64 } from "../src/common";
import { mintKibble } from "../src/kibble";
import { getKittyItemCount, mintKittyItem, getKittyItem, typeID1, typeID2 } from "../src/kitty-items";
import {
	deployNFTStorefront,
	buyItem,
	sellItem,
	removeItem,
	setupStorefrontOnAccount,
	getSaleOfferCount,
} from "../src/nft-storefront";
import { mintFUSD } from "../src/FUSD";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("NFT Storefront", () => {
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 7003;
		await init(basePath, { port });
		return emulator.start(port, false);
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		return emulator.stop();
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

	it("shall be able to create a sale offers", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);

		// Mint KittyItems for Alice's account
		await shallPass(mintKittyItem(typeID1, Alice));
		await shallPass(mintKittyItem(typeID2, Alice));

		const firstID = 0;
		const secondID = 1;

		await shallPass(sellItem("fusd", Alice, firstID, toUFix64(1.11)));
		await shallPass(sellItem("kibble", Alice, secondID, toUFix64(1.11)));
	});

	it("shall be able to accept a sale offers", async () => {
		// Setup
		await deployNFTStorefront();

		// Setup seller account
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
		await mintKittyItem(typeID1, Alice);
		await shallPass(mintKittyItem(typeID2, Alice));

		const firstID = 0;
		const secondID = 1;

		// Setup buyer account
		const Bob = await getAccountAddress("Bob");
		await setupStorefrontOnAccount(Bob);

		await shallPass(mintKibble(Bob, toUFix64(100)));
		await shallPass(mintFUSD(Bob, toUFix64(100)));

		// Bob shall be able to buy from Alice
		const sellForKibbleTx = await shallPass(sellItem("kibble", Alice, firstID, toUFix64(1.11)));
		const sellForFUSDTx = await shallPass(sellItem("fusd", Alice, secondID, toUFix64(1.11)));

		const saleOfferAvailableKibbleEvent = sellForKibbleTx.events[0];
		const saleOfferAvailableFUSDEvent = sellForFUSDTx.events[0];
		const saleOfferKibbleResourceID = saleOfferAvailableKibbleEvent.data.saleOfferResourceID;
		const saleOfferFUSDResourceID = saleOfferAvailableFUSDEvent.data.saleOfferResourceID;

		await shallPass(buyItem("kibble", Bob, saleOfferKibbleResourceID, Alice));
		await shallPass(buyItem("fusd", Bob, saleOfferFUSDResourceID, Alice));

		const itemCount = await getKittyItemCount(Bob);
		expect(itemCount).toBe(1);

		const offerCount = await getSaleOfferCount(Alice);
		expect(offerCount).toBe(0);
	});

	it("shall be able to remove a sale offer", async () => {
		// Deploy contracts
		await shallPass(deployNFTStorefront());

		// Setup Alice account
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupStorefrontOnAccount(Alice));

		// Mint instruction shall pass
		await shallPass(mintKittyItem(typeID1, Alice));

		const itemId = 0;

		const item = await getKittyItem(Alice, itemId);

		// Listing item for sale shall pass
		const sellItemTransactionResult = await shallPass(sellItem("kibble", Alice, itemId, toUFix64(1.11)));

		const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
		const saleOfferResourceID = saleOfferAvailableEvent.data.saleOfferResourceID;

		// Alice shall be able to remove item from sale
		await shallPass(removeItem(Alice, saleOfferResourceID));

		const offerCount = await getSaleOfferCount(Alice);
		expect(offerCount).toBe(0);
	});
});
