import { describe, expect, it } from "vitest";
import type { Holding } from "./rebalance";
import { decodeHoldings, encodeHoldings } from "./rebalanceUrl";

describe("encodeHoldings", () => {
	it("produces a pipe-delimited string with ticker:value:weight", () => {
		const holdings: Holding[] = [
			{ ticker: "VTI", value: 5400, targetWeight: 0.54 },
			{ ticker: "VXUS", value: 3600, targetWeight: 0.36 },
		];
		expect(encodeHoldings(holdings)).toBe("VTI:5400:54|VXUS:3600:36");
	});

	it("preserves decimal target weights", () => {
		const holdings: Holding[] = [
			{ ticker: "BND", value: 1000, targetWeight: 0.105 },
		];
		expect(encodeHoldings(holdings)).toBe("BND:1000:10.5");
	});

	it("returns empty string for empty array", () => {
		expect(encodeHoldings([])).toBe("");
	});
});

describe("decodeHoldings", () => {
	it("parses a valid encoded string", () => {
		const result = decodeHoldings("VTI:5400:54|VXUS:3600:36")!;
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ ticker: "VTI", value: 5400, targetWeight: 0.54 });
		expect(result[1]).toEqual({ ticker: "VXUS", value: 3600, targetWeight: 0.36 });
	});

	it("returns null for empty string", () => {
		expect(decodeHoldings("")).toBeNull();
	});

	it("skips entries with wrong number of parts", () => {
		const result = decodeHoldings("VTI:5400|BND:1000:10")!;
		expect(result).toHaveLength(1);
		expect(result[0].ticker).toBe("BND");
	});

	it("skips entries with non-finite values", () => {
		const result = decodeHoldings("VTI:abc:54|BND:1000:10")!;
		expect(result).toHaveLength(1);
		expect(result[0].ticker).toBe("BND");
	});

	it("returns null when all entries are invalid", () => {
		expect(decodeHoldings("|||")).toBeNull();
	});

	it("roundtrips with encodeHoldings", () => {
		const original: Holding[] = [
			{ ticker: "VTI", value: 5400, targetWeight: 0.54 },
			{ ticker: "VXUS", value: 3600, targetWeight: 0.36 },
			{ ticker: "BND", value: 1000, targetWeight: 0.1 },
		];
		expect(decodeHoldings(encodeHoldings(original))).toEqual(original);
	});
});
