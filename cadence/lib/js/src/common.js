import { getAccountAddress } from "flow-js-testing/dist/utils/account";
import { transferKibble } from "./kibble";
import { promisify } from "util";

const UFIX64_PRECISION = 8;

// UFix64 values shall be always passed as strings
export const toUFix64 = (value) => value.toFixed(UFIX64_PRECISION);

export const getRegistry = async () => {
	return getAccountAddress("Registry");
};

export const promise = async (ix) => {
	if (typeof ix === "function") {
		return await ix();
	}
	return await ix;
};

export const shallPass = async (ix) => {
	const tx = promise(ix);
	await expect(
		(async () => {
			const { status, errorMessage } = await tx;
			expect(status).toBe(4);
			expect(errorMessage).toBe("");
		})()
	).resolves.not.toThrow();

	return tx;
};

export const shallResolve = async (ix) => {
	const tx = promise(ix);
	await expect(promise(tx)).resolves.not.toThrow();

	return tx;
};

export const shallRevert = async (ix) => {
	const tx = promise(ix);
	await expect(tx).rejects.not.toBe(null);
	
	return tx;
};
