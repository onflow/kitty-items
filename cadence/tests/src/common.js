import { deployContractByName, executeScript, getAccountAddress, sendTransaction } from "@onflow/flow-js-testing";

const UFIX64_PRECISION = 8;

// UFix64 values shall be always passed as strings
export const toUFix64 = (value) => value.toFixed(UFIX64_PRECISION);

export const getKittyAdminAddress = async () => getAccountAddress("KittyAdmin");

export const sendTransactionWithErrorRaised = async (...props) => {
    const [resp, err] = await sendTransaction(...props);
    if (err) {
        throw err;
    }
    return resp;
}

export const executeScriptWithErrorRaised = async (...props) => {
    const [resp, err] = await executeScript(...props);
    if (err) {
        throw err;
    }
    return resp;
}

export const deployContractByNameWithErrorRaised = async (...props) => {
    const [resp, err] = await deployContractByName(...props);
    if (err) {
        throw err;
    }
    return resp;
}
