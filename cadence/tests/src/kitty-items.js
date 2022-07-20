import { mintFlow, executeScript, sendTransaction, deployContractByName } from "@onflow/flow-js-testing";
import { getKittyAdminAddress } from "./common";

export const types = {
	fishbowl: 1,
	fishhat: 2,
	milkshake: 3,
	tuktuk: 4,
	skateboard: 5
};

export const rarities = {
	blue: 1,
	green: 2,
	purple: 3,
	gold: 4
};

/*
 * Deploys NonFungibleToken and KittyItems contracts to KittyAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const deployKittyItems = async () => {
	const KittyAdmin = await getKittyAdminAddress();
	await mintFlow(KittyAdmin, "10.0");

	await deployContractByName({ to: KittyAdmin, name: "NonFungibleToken" });
	await deployContractByName({ to: KittyAdmin, name: "MetadataViews" });
	return deployContractByName({ to: KittyAdmin, name: "KittyItems" });
};

/*
 * Setups KittyItems collection on account and exposes public capability.
 * @param {string} account - account address
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const setupKittyItemsOnAccount = async (account) => {
	const name = "kittyItems/setup_account";
	const signers = [account];

	return sendTransaction({ name, signers });
};

/*
 * Returns KittyItems supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getKittyItemSupply = async () => {
	const name = "kittyItems/get_kitty_items_supply";

	return executeScript({ name });
};

/*
 * Mints KittyItem of a specific **itemType** and sends it to **recipient**.
 * @param {UInt64} itemType - type of NFT to mint
 * @param {string} recipient - recipient account address
 * @returns {Promise<[{*} result, {error} error]>}
 * */
export const mintKittyItem = async (recipient, itemType, itemRarity) => {
	const KittyAdmin = await getKittyAdminAddress();

	const name = "kittyItems/mint_kitty_item";
	const args = [recipient, itemType, itemRarity];
	const signers = [KittyAdmin];

	return sendTransaction({ name, args, signers });
};

/*
 * Transfers KittyItem NFT with id equal **itemId** from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {UInt64} itemId - id of the item to transfer
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const transferKittyItem = async (sender, recipient, itemId) => {
	const name = "kittyItems/transfer_kitty_item";
	const args = [recipient, itemId];
	const signers = [sender];

	return sendTransaction({ name, args, signers });
};

/*
 * Returns the KittyItem NFT with the provided **id** from an account collection.
 * @param {string} account - account address
 * @param {UInt64} itemID - NFT id
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getKittyItem = async (account, itemID) => {
	const name = "kittyItems/get_kitty_item";
	const args = [account, itemID];

	return executeScript({ name, args });
};

/*
 * Returns the number of Kitty Items in an account's collection.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getKittyItemCount = async (account) => {
	const name = "kittyItems/get_collection_length";
	const args = [account];

	return executeScript({ name, args });
};
