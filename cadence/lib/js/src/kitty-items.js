import { Address, UInt64 } from "@onflow/types";
import {
	deployContractByName,
	executeScript,
	getContractAddress,
	getScriptCode,
	getTransactionCode,
	mintFlow,
	sendTransaction,
} from "flow-js-testing";

import { getRegistry } from "./common";

// KittyItems types
export const typeID1 = 1000;
export const typeID2 = 2000;
export const typeID1337 = 1337;

/*
 * Deploys NonFungibleToken and KittyItems contracts to Registry.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployKittyItems = async () => {
	const Registry = await getRegistry();
	await mintFlow(Registry, "10.0");

	await deployContractByName({ to: Registry, name: "NonFungibleToken" });

	const addressMap = { NonFungibleToken: Registry };
	return deployContractByName({ to: Registry, name: "KittyItems", addressMap });
};

/*
 * Setups KittyItems collection on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupKittyItemsOnAccount = async (account) => {
	const NonFungibleToken = await getContractAddress("NonFungibleToken");
	const KittyItems = await getContractAddress("KittyItems");

	const name = "kittyItems/setup_account";
	const addressMap = { NonFungibleToken, KittyItems };

	const code = await getTransactionCode({ name, addressMap });
	const signers = [account];

	return sendTransaction({ code, signers });
};

/*
 * Returns KittyItems supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getKittyItemSupply = async () => {
	const KittyItems = await getContractAddress("KittyItems");
	const name = "kittyItems/read_kitty_items_supply";
	const addressMap = { KittyItems };

	const code = await getScriptCode({ name, addressMap });

	return executeScript({ code });
};

/*
 * Mints KittyItem of a specific **itemType** and sends it to **recipient**.
 * @param {UInt64} itemType - type of NFT to mint
 * @param {string} recipient - account address
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const mintKittyItem = async (itemType, recipient) => {
	const Registry = await getRegistry();

	const NonFungibleToken = await getContractAddress("NonFungibleToken");
	const KittyItems = await getContractAddress("KittyItems");

	const name = "kittyItems/mint_kitty_item";
	const addressMap = { NonFungibleToken, KittyItems };

	const code = await getTransactionCode({ name, addressMap });
	const signers = [Registry];
	const args = [
		[recipient, Address],
		[itemType, UInt64],
	];

	return sendTransaction({ code, signers, args });
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
	const NonFungibleToken = await getContractAddress("NonFungibleToken");
	const KittyItems = await getContractAddress("KittyItems");

	const name = "kittyItems/transfer_kitty_item";
	const addressMap = { NonFungibleToken, KittyItems };

	const code = await getTransactionCode({ name, addressMap });
	const signers = [sender];
	const args = [
		[recipient, Address],
		[itemId, UInt64],
	];

	return sendTransaction({ code, signers, args });
};

/*
 * Returns the type of KittyItems NFT with **id** in account collection.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getKittyItemById = async (account, id) => {
	const KittyItems = await getContractAddress("KittyItems");
	const NonFungibleToken = await getContractAddress("NonFungibleToken");

	const name = "kittyItems/read_kitty_item_type_id";
	const addressMap = { KittyItems, NonFungibleToken };

	const code = await getScriptCode({ name, addressMap });
	const args = [
		[account, Address],
		[id, UInt64],
	];

	return executeScript({ code, args });
};

/*
 * Returns the length of account's KittyItems collection.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getCollectionLength = async (account) => {
	const KittyItems = await getContractAddress("KittyItems");
	const NonFungibleToken = await getContractAddress("NonFungibleToken");

	const name = "kittyItems/read_collection_length";
	const addressMap = { NonFungibleToken, KittyItems };

	const code = await getScriptCode({ name, addressMap });
	const args = [[account, Address]];

	return executeScript({ code, args });
};
