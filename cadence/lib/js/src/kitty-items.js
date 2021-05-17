import { Address, UFix64 } from "@onflow/types";
import {
	deployContractByName,
	executeScript,
	getAccountAddress,
	getContractAddress,
	getScriptCode,
	getTransactionCode,
	mintFlow,
	sendTransaction,
} from "flow-js-testing";
import { getRegistry } from "./common";

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

export const getCollectionLength = async () => {
	const Registry = await getRegistry();

	const name = "kittyItems/read_collection_length";
	const addressMap = {
		NonFungibleToken: Registry,
		Kibble: Registry,
	};

	const code = await getScriptCode({ name, addressMap });
	return executeScript({ code });
};
