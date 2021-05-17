import { getAccountAddress } from "flow-js-testing/dist/utils/account";

const UFIX64_PRECISION = 8;
export const toUFix64 = (value) => value.toFixed(UFIX64_PRECISION);

export const getRegistry = async () => {
	return getAccountAddress("Registry");
};
