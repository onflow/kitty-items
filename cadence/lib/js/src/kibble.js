import { deployContractByName, executeScript, mintFlow, sendTransaction } from "flow-js-testing";
import { getKittyAdminAddress } from "./common";

/*
 * Deploys Kibble contract to KittyAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployKibble = async () => {
	const KittyAdmin = await getKittyAdminAddress();
	await mintFlow(KittyAdmin, "10.0");

	return deployContractByName({ to: KittyAdmin, name: "Kibble" });
};

/*
 * Setups Kibble Vault on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupKibbleOnAccount = async (account) => {
	const name = "kibble/setup_account";
	const signers = [account];

	return sendTransaction({ name, signers });
};

/*
 * Returns Kibble balance for **account**.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getKibbleBalance = async (account) => {
	const name = "kibble/get_balance";
	const args = [account];

	return executeScript({ name, args });
};

/*
 * Returns Kibble supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getKibbleSupply = async () => {
	const name = "kibble/get_supply";
	return executeScript({ name });
};

/*
 * Mints **amount** of Kibble tokens and transfers them to recipient.
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to mint
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const mintKibble = async (recipient, amount) => {
	const KittyAdmin = await getKittyAdminAddress();

	const name = "kibble/mint_tokens";
	const args = [recipient, amount];
	const signers = [KittyAdmin];

	return sendTransaction({ name, args, signers });
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
	const name = "kibble/transfer_tokens";
	const args = [amount, recipient];
	const signers = [sender];

	return sendTransaction({ name, args, signers });
};
