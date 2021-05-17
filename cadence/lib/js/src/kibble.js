import { Address, UFix64 } from "@onflow/types";
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

// TODO: Add docstrings for methods
export const deployKibble = async () => {
	const Registry = await getRegistry();
	await mintFlow(Registry, "10.0");

	await deployContractByName({ to: Registry, name: "FungibleToken" });

	const addressMap = { FungibleToken: Registry };
	await deployContractByName({ to: Registry, name: "Kibble", addressMap });
};

export const setupKibbleOnAccount = async (address) => {
	const FungibleToken = await getContractAddress("FungibleToken");
	const Kibble = await getContractAddress("Kibble");

	const name = "kibble/setup_account";
	const addressMap = { FungibleToken, Kibble };

	const code = await getTransactionCode({ name, addressMap });
	const signers = [address];

	return sendTransaction({ code, signers });
};

export const getKibbleBalance = async (accountAddress) => {
	const Registry = await getRegistry();

	const name = "kibble/get_balance";
	const addressMap = {
		FungibleToken: Registry,
		Kibble: Registry,
	};

	const code = await getScriptCode({ name, addressMap });
	const args = [[accountAddress, Address]];

	return executeScript({ code, args });
};

export const getKibbleSupply = async () => {
	const Registry = await getRegistry();

	const name = "kibble/get_supply";
	const addressMap = { Kibble: Registry };

	const code = await getScriptCode({ name, addressMap });
	return executeScript({ code });
};

export const mintKibble = async (recipient, amount) => {
	const Registry = await getRegistry();

	const name = "kibble/mint_tokens";
	const addressMap = {
		FungibleToken: Registry,
		Kibble: Registry,
	};

	const code = await getTransactionCode({ name, addressMap });
	const signers = [Registry];
	const args = [
		[recipient, Address],
		[amount, UFix64],
	];

	return sendTransaction({
		code,
		signers,
		args,
	});
};

export const transferKibble = async (from, to, amount) => {
	const Registry = await getRegistry();

	const name = "kibble/transfer_tokens";
	const addressMap = {
		FungibleToken: Registry,
		Kibble: Registry,
	};

	const code = await getTransactionCode({ name, addressMap });
	const signers = [from];
	const args = [
		[amount, UFix64],
		[to, Address],
	];

	return sendTransaction({
		code,
		signers,
		args,
	});
};
