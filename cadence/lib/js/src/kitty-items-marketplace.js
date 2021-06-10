import { UFix64, UInt64, Address } from "@onflow/types";
import {
	getContractAddress,
	deployContractByName,
	getTransactionCode,
	getScriptCode,
	executeScript,
	sendTransaction,
} from "flow-js-testing";

import { getKittyAdminAddress } from "./common";
import { deployKibble, setupKibbleOnAccount } from "./kibble";
import { deployKittyItems, setupKittyItemsOnAccount } from "./kitty-items";

/*
 * Deploys Kibble, KittyItems and KittyItemsMarket contracts to KittyAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployMarketplace = async () => {
	const KittyAdmin = await getKittyAdminAddress();

	await deployKibble();
	await deployKittyItems();

	const addressMap = {
		NonFungibleToken: KittyAdmin,
		Kibble: KittyAdmin,
		KittyItems: KittyAdmin,
	};

	return deployContractByName({ to: KittyAdmin, name: "KittyItemsMarket", addressMap });
};

/*
 * Setups KittyItemsMarket collection on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupMarketplaceOnAccount = async (account) => {
	// Account should be able to store kitty items and operate Kibbles
	await setupKibbleOnAccount(account);
	await setupKittyItemsOnAccount(account);

	const KittyItemsMarket = await getContractAddress("KittyItemsMarket");
	const addressMap = { KittyItemsMarket };

	const name = "kittyItemsMarket/setup_account";

	const code = await getTransactionCode({ name, addressMap });
	const signers = [account];

	return sendTransaction({ code, signers });
};

/*
 * Lists item with id equal to **item** id for sale with specified **price**.
 * @param {string} seller - seller account address
 * @param {UInt64} itemId - id of item to sell
 * @param {UFix64} price - price
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const listItemForSale = async (seller, itemId, price) => {
	const KittyAdmin = await getKittyAdminAddress();

	const addressMap = {
		NonFungibleToken: KittyAdmin,
		Kibble: KittyAdmin,
		KittyItems: KittyAdmin,
		KittyItemsMarket: KittyAdmin,
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

/*
 * Buys item with id equal to **item** id for **price** from **seller**.
 * @param {string} buyer - buyer account address
 * @param {UInt64} itemId - id of item to sell
 * @param {string} seller - seller account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const buyItem = async (buyer, itemId, seller) => {
	const KittyAdmin = await getKittyAdminAddress();

	const addressMap = {
		NonFungibleToken: KittyAdmin,
		Kibble: KittyAdmin,
		KittyItems: KittyAdmin,
		KittyItemsMarket: KittyAdmin,
	};

	const name = "kittyItemsMarket/buy_market_item";

	const code = await getTransactionCode({ name, addressMap });
	const signers = [buyer];
	const args = [
		[itemId, UInt64],
		[seller, Address],
	];
	return sendTransaction({ code, signers, args });
};

/*
 * Removes item with id equal to **item** from sale.
 * @param {string} owner - owner address
 * @param {UInt64} itemId - id of item to remove
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const removeItem = async (owner, itemId) => {
	const KittyItemsMarket = await getContractAddress("KittyItemsMarket");

	const addressMap = { KittyItemsMarket };
	const name = "kittyItemsMarket/remove_market_item";

	const code = await getTransactionCode({ name, addressMap });
	const signers = [owner];
	const args = [[itemId, UInt64]];

	return sendTransaction({ code, signers, args });
};

/*
 * Returns the length of list of items for sale.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getMarketCollectionLength = async (account) => {
	const KittyItemsMarket = await getContractAddress("KittyItemsMarket");

	const name = "kittyItemsMarket/read_collection_length";
	const addressMap = { KittyItemsMarket };

	const code = await getScriptCode({ name, addressMap });
	const args = [[account, account, Address]];

	return executeScript({ code, args });
};
