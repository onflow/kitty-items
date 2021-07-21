import { deployContractByName, executeScript, sendTransaction } from "flow-js-testing";
import { getKittyAdminAddress } from "./common";
import { deployKibble, setupKibbleOnAccount } from "./kibble";
import { deployKittyItems, setupKittyItemsOnAccount } from "./kitty-items";

/*
 * Deploys Kibble, KittyItems and NFTStorefront contracts to KittyAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployNFTStorefront = async () => {
	const KittyAdmin = await getKittyAdminAddress();

	await deployKibble();
	await deployKittyItems();

	const addressMap = {
		NonFungibleToken: KittyAdmin,
		Kibble: KittyAdmin,
		KittyItems: KittyAdmin,
	};

	return deployContractByName({ to: KittyAdmin, name: "NFTStorefront", addressMap });
};

/*
 * Sets up NFTStorefront.Storefront on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupStorefrontOnAccount = async (account) => {
	// Account shall be able to store kitty items and operate Kibbles
	await setupKibbleOnAccount(account);
	await setupKittyItemsOnAccount(account);

	const name = "nftStorefront/setup_account";
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
export const sellItem = async (seller, itemId, price) => {
	const name = "nftStorefront/sell_item";
	const args = [itemId, price];
	const signers = [seller];

	return sendTransaction({ name, args, signers });
};

/*
 * Buys item with id equal to **item** id for **price** from **seller**.
 * @param {string} buyer - buyer account address
 * @param {UInt64} resourceId - resource uuid of item to sell
 * @param {string} seller - seller account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const buyItem = async (buyer, resourceId, seller) => {
	const name = "nftStorefront/buy_item";
	const args = [resourceId, seller];
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
	const name = "nftStorefront/remove_item";
	const signers = [owner];
	const args = [itemId];

	return sendTransaction({ name, args, signers });
};

/*
 * Returns the number of items for sale in a given account's storefront.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getSaleOfferCount = async (account) => {
	const name = "nftStorefront/get_sale_offers_length";
	const args = [account];

	return executeScript({ name, args });
};
