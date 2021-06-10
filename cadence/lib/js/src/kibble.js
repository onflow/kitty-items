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

/*
 * Deploys Kibble contract to Registry.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployKibble = async () => {
	const Registry = await getRegistry();
	await mintFlow(Registry, "10.0");

	return deployContractByName({ to: Registry, name: "Kibble" });
};

/*
 * Setups Kibble Vault on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupKibbleOnAccount = async (account) => {
	const Kibble = await getContractAddress("Kibble");

	const name = "kibble/setup_account";
	const addressMap = { Kibble };

	const code = await getTransactionCode({ name, addressMap });
	const signers = [account];

	return sendTransaction({ code, signers });
};

/*
 * Returns Kibble balance for **account**.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getKibbleBalance = async (account) => {
	const Registry = await getRegistry();

	const name = "kibble/get_balance";
	const addressMap = { Kibble: Registry };

	const code = await getScriptCode({ name, addressMap });
	const args = [[account, Address]];

	return executeScript({ code, args });
};

/*
 * Returns Kibble supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getKibbleSupply = async () => {
	const Registry = await getRegistry();

	const name = "kibble/get_supply";
	const addressMap = { Kibble: Registry };

	const code = await getScriptCode({ name, addressMap });
	return executeScript({ code });
};

/*
 * Mints **amount** of Kibble tokens and transfers them to recipient.
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to mint
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const mintKibble = async (recipient, amount) => {
	const Registry = await getRegistry();

	const name = "kibble/mint_tokens";
	const addressMap = { Kibble: Registry };

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

/*
 * Transfers **amount** of Kibble tokens from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to transfer
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const transferKibble = async (sender, recipient, amount) => {
	const Registry = await getRegistry();

	const name = "kibble/transfer_tokens";
	const addressMap = { Kibble: Registry };

	const code = await getTransactionCode({ name, addressMap });
	const signers = [sender];
	const args = [
		[amount, UFix64],
		[recipient, Address],
	];

	return sendTransaction({
		code,
		signers,
		args,
	});
};
