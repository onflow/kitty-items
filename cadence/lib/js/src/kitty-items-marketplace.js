import { UFix64, UInt64, Address } from "@onflow/types";
import { getContractAddress, deployContractByName, getTransactionCode, sendTransaction } from "flow-js-testing/dist";

import { getRegistry } from "./common";
import { deployKibble, setupKibbleOnAccount } from "./kibble";
import { deployKittyItems, setupKittyItemsOnAccount } from "./kitty-items";
import { getScriptCode } from "flow-js-testing/dist/utils/file";
import { executeScript } from "flow-js-testing/dist/utils/interaction";

export const deployMarketplace = async () => {
	const Registry = await getRegistry();

	await deployKibble();
	await deployKittyItems();

	const addressMap = {
		FungibleToken: Registry,
		NonFungibleToken: Registry,
		Kibble: Registry,
		KittyItems: Registry,
	};

	return deployContractByName({ to: Registry, name: "KittyItemsMarket", addressMap });
};

export const setupMarketplaceOnAccount = async (address) => {
	// Account should be able to store kitty items and operate Kibbles
	await setupKibbleOnAccount(address);
	await setupKittyItemsOnAccount(address);

	const KittyItemsMarket = await getContractAddress("KittyItemsMarket");
	const addressMap = { KittyItemsMarket };

	const name = "kittyItemsMarket/setup_account";

	const code = await getTransactionCode({ name, addressMap });
	const signers = [address];

	return sendTransaction({ code, signers });
};

export const listItemForSale = async (seller, itemId, price) => {
	const Registry = await getRegistry();

	const addressMap = {
		FungibleToken: Registry,
		NonFungibleToken: Registry,
		Kibble: Registry,
		KittyItems: Registry,
		KittyItemsMarket: Registry,
	};

	const name = "kittyItemsMarket/sell_market_item";

	const code = await getTransactionCode({ name, addressMap });
	const signers = [seller];
	const args = [
		[itemId, UInt64],
		[price, UFix64],
	];

	return sendTransaction({ code, signers, args });
};

export const buyItem = async (buyer, itemId, marketCollectionAddress) => {
	const Registry = await getRegistry();

	const addressMap = {
		FungibleToken: Registry,
		NonFungibleToken: Registry,
		Kibble: Registry,
		KittyItems: Registry,
		KittyItemsMarket: Registry,
	};

	const name = "kittyItemsMarket/buy_market_item";

	const code = await getTransactionCode({ name, addressMap });
	const signers = [buyer];
	const args = [
		[itemId, UInt64],
		[marketCollectionAddress, Address],
	];
	return sendTransaction({ code, signers, args });
};

export const removeItem = async (owner, itemId) => {
	const KittyItemsMarket = await getContractAddress("KittyItemsMarket");

	const addressMap = { KittyItemsMarket };
	const name = "kittyItemsMarket/remove_market_item";

	const code = await getTransactionCode({ name, addressMap });
	const signers = [owner];
	const args = [[itemId, UInt64]];

	return sendTransaction({ code, signers, args });
};

export const getMarketCollectionLength = async (account) => {
	const KittyItemsMarket = await getContractAddress("KittyItemsMarket");

	const name = "kittyItemsMarket/read_collection_length";
	const addressMap = { KittyItemsMarket };

	const code = await getScriptCode({ name, addressMap });
	const args = [[account, account, Address]];

	return executeScript({ code, args });
};
