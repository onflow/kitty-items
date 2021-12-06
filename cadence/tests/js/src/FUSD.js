import { deployContractByName, executeScript, mintFlow, sendTransaction } from "flow-js-testing";
import { getAdminAddress } from "./common";

export const deployFUSD = async () => {
	const Admin = await getAdminAddress();
	return deployContractByName({ to: Admin, name: "FUSD" });
};

export const setupFUSDOnAccount = async (account) => {
	const name = "fusd/setup_account";
	const signers = [account];

	return sendTransaction({ name, signers });
};

export const getFUSDBalance = async (account) => {
	const name = "fusd/get_balance";
	const args = [account];

	return executeScript({ name, args });
};

export const mintFUSD = async (recipient, amount) => {
	const Admin = await getAdminAddress();

	const name = "fusd/mint_tokens";
	const args = [recipient, amount];
	const signers = [Admin];

	return sendTransaction({ name, args, signers });
};

export const sendFUSD = async (sender, recipient, amount) => {

	const name = "fusd/transfer_tokens";

	const args = [amount, recipient];
	const signers = [sender];

	return sendTransaction({ name, args, signers });
};