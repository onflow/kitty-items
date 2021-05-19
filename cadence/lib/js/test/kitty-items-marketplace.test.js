import path from "path";

import { emulator } from "../emulator";
import { getRegistry } from "../src/common";
import { init } from "flow-js-testing/dist/utils/init";
import { deployKibble } from "../src/kibble";
import { deployKittyItems } from "../src/kitty-items";
import { deployMarketplace } from "../src/kitty-items-marketplace";

jest.setTimeout(10000);

describe("Kitty Items Marketplace", () => {
	beforeEach(async (done) => {
		init(path.resolve(__dirname, "../../../"));
		await emulator.start(false);
		done();
	});

	afterEach(async (done) => {
		await emulator.stop();
		done();
	});

	test("should deploy KittyItemsMarket contract", async () => {
		await expect(deployMarketplace()).resolves.not.toThrow();
	});
	/*
	test("", async () => {});
	test("", async () => {});
	test("", async () => {});
	test("", async () => {});

	 */
});
