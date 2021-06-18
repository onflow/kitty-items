import { deployContractByName, executeScript, sendTransaction } from "flow-js-testing";
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
	// Account shall be able to store kitty items and operate Kibbles
	await setupKibbleOnAccount(account);
	await setupKittyItemsOnAccount(account);

	const name = "kittyItemsMarket/setup_account";
	const signers = [account];

	return sendTransaction({ name, signers });
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
	const name = "kittyItemsMarket/create_sale_offer";
	const args = [itemId, price];
	const signers = [seller];

	return sendTransaction({ name, args, signers });
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
	const name = "kittyItemsMarket/buy_market_item";
	const args = [itemId, seller];
	const signers = [buyer];

	return sendTransaction({ name, args, signers });
};

/*
 * Removes item with id equal to **item** from sale.
 * @param {string} owner - owner address
 * @param {UInt64} itemId - id of item to remove
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const removeItem = async (owner, itemId) => {
	const name = "kittyItemsMarket/remove_sale_offer";
	const signers = [owner];
	const args = [itemId];

	return sendTransaction({ name, args, signers });
};

/*
 * Returns the length of list of items for sale.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getMarketCollectionLength = async (account) => {
	const name = "kittyItemsMarket/get_collection_length";
	const args = [account, account];

	return executeScript({ name, args });
};
