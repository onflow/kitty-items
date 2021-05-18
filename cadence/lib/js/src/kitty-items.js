import { Address, UFix64, UInt64 } from "@onflow/types";
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

export const deployKittyItems = async () => {
	const Registry = await getRegistry();
	await mintFlow(Registry, "10.0");

	await deployContractByName({ to: Registry, name: "NonFungibleToken" });

	const addressMap = { NonFungibleToken: Registry };
	await deployContractByName({ to: Registry, name: "KittyItems", addressMap });
};

export const setupKittyItemsOnAccount = async (address) => {
	const NonFungibleToken = await getContractAddress("NonFungibleToken");
	const KittyItems = await getContractAddress("KittyItems");

	const name = "kittyItems/setup_account";
	const addressMap = { NonFungibleToken, KittyItems };

	const code = await getTransactionCode({ name, addressMap });
	const signers = [address];

	return sendTransaction({ code, signers });
};

export const getKittyItemSupply = async () => {
	const KittyItems = await getContractAddress("KittyItems");
	const name = "kittyItems/read_kitty_items_supply";
	const addressMap = { KittyItems };

	const code = await getScriptCode({ name, addressMap });

	return executeScript({ code });
};

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

export const getAmountOfItemsInAccount = async (account) => {
	const KittyItems = await getContractAddress("KittyItems");
	const NonFungibleToken = await getContractAddress("NonFungibleToken");

	const name = "kittyItems/read_collection_length";
	const addressMap = { KittyItems, NonFungibleToken };

	const code = await getScriptCode({ name, addressMap });
	const args = [[account, Address]];

	return executeScript({ code, args });
};

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

export const getCollectionLength = async (account) => {
	const KittyItems = await getContractAddress("KittyItems");
	const NonFungibleToken = await getContractAddress("NonFungibleToken");

	const name = "kittyItems/read_collection_length";
	const addressMap = { NonFungibleToken, KittyItems };

	const code = await getScriptCode({ name, addressMap });
	const args = [[account, Address]];

	return executeScript({ code, args });
};
