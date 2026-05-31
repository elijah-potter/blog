import { describe, expect, it } from "vitest";
import type { Holding } from "./rebalance";
import { rebalance, rebalanceWithCashflow } from "./rebalance";

describe("rebalance", () => {
	it("returns buy/sell/hold actions for a standard portfolio", () => {
		const holdings: Holding[] = [
			{ ticker: "VTI", value: 6000, targetWeight: 0.5 },
			{ ticker: "BND", value: 4000, targetWeight: 0.5 },
		];
		const result = rebalance(holdings);
		expect(result).toHaveLength(2);

		const vti = result.find((a) => a.ticker === "VTI")!;
		const bnd = result.find((a) => a.ticker === "BND")!;

		expect(vti.action).toBe("sell");
		expect(vti.amount).toBeGreaterThan(0);
		expect(bnd.action).toBe("buy");
		expect(bnd.amount).toBeGreaterThan(0);
	});

	it("returns all holds when portfolio is already balanced", () => {
		const holdings: Holding[] = [
			{ ticker: "VTI", value: 5000, targetWeight: 0.5 },
			{ ticker: "BND", value: 5000, targetWeight: 0.5 },
		];
		const result = rebalance(holdings);

		for (const action of result) {
			expect(action.action).toBe("hold");
			expect(action.amount).toBe(0);
		}
	});

	it("handles a single holding at 100% weight", () => {
		const holdings: Holding[] = [{ ticker: "VTI", value: 10000, targetWeight: 1 }];
		const result = rebalance(holdings);
		expect(result[0].action).toBe("hold");
		expect(result[0].amount).toBe(0);
	});

	it("throws if weights do not sum to 1", () => {
		const holdings: Holding[] = [
			{ ticker: "VTI", value: 5000, targetWeight: 0.6 },
			{ ticker: "BND", value: 5000, targetWeight: 0.6 },
		];
		expect(() => rebalance(holdings)).toThrow();
	});

	it("preserves portfolio total across actions", () => {
		const holdings: Holding[] = [
			{ ticker: "VTI", value: 7000, targetWeight: 0.5 },
			{ ticker: "VXUS", value: 3000, targetWeight: 0.5 },
		];
		const result = rebalance(holdings);
		const totalBuys = result
			.filter((a) => a.action === "buy")
			.reduce((s, a) => s + a.amount, 0);
		const totalSells = result
			.filter((a) => a.action === "sell")
			.reduce((s, a) => s + a.amount, 0);
		expect(totalBuys).toBeCloseTo(totalSells, 2);
	});
});

describe("rebalanceWithCashflow", () => {
	const holdings: Holding[] = [
		{ ticker: "VTI", value: 4000, targetWeight: 0.5 },
		{ ticker: "VXUS", value: 2000, targetWeight: 0.3 },
		{ ticker: "BND", value: 2000, targetWeight: 0.2 },
	];

	it("allocates cash proportionally to underweight holdings", () => {
		const { actions } = rebalanceWithCashflow(holdings, 2000);

		const vti = actions.find((a) => a.ticker === "VTI")!;
		const vxus = actions.find((a) => a.ticker === "VXUS")!;

		expect(vti.action).toBe("buy");
		expect(vxus.action).toBe("buy");

		expect(vti.amount).toBeCloseTo(1000, 0);
		expect(vxus.amount).toBeCloseTo(1000, 0);
	});

	it("does not allocate cash to overweight holdings", () => {
		const overweight: Holding[] = [
			{ ticker: "VTI", value: 8000, targetWeight: 0.5 },
			{ ticker: "BND", value: 2000, targetWeight: 0.5 },
		];
		const { actions } = rebalanceWithCashflow(overweight, 1000);

		const vti = actions.find((a) => a.ticker === "VTI")!;
		expect(vti.action).toBe("hold");
		expect(vti.amount).toBe(0);
	});

	it("correctly handles a holding at exactly its target", () => {
		const atTarget: Holding[] = [
			{ ticker: "VTI", value: 5500, targetWeight: 0.5 },
			{ ticker: "BND", value: 4500, targetWeight: 0.5 },
		];
		const { actions } = rebalanceWithCashflow(atTarget, 1000);

		const vti = actions.find((a) => a.ticker === "VTI")!;
		const bnd = actions.find((a) => a.ticker === "BND")!;

		expect(vti.action).toBe("hold");
		expect(vti.amount).toBe(0);
		expect(bnd.action).toBe("buy");
		expect(bnd.amount).toBeGreaterThan(0);
	});

	it("returns all holds and zero unallocated for zero cash", () => {
		const { actions, unallocatedCash } = rebalanceWithCashflow(holdings, 0);

		for (const a of actions) {
			expect(a.action).toBe("hold");
		}
		expect(unallocatedCash).toBe(0);
	});

	it("throws if weights do not sum to 1", () => {
		const bad: Holding[] = [
			{ ticker: "VTI", value: 5000, targetWeight: 0.6 },
			{ ticker: "BND", value: 5000, targetWeight: 0.6 },
		];
		expect(() => rebalanceWithCashflow(bad, 1000)).toThrow();
	});
});
