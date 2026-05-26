/** Types ------------------------------------------------------------------ */

export interface Holding {
	ticker: string;
	value: number;
	targetWeight: number; // 0–1 (e.g. 0.54 for 54 %)
}

export interface RebalanceAction {
	ticker: string;
	current: number;
	target: number;
	action: "buy" | "sell" | "hold";
	amount: number;
}

/** Helpers ----------------------------------------------------------------- */

const WEIGHT_TOLERANCE = 0.005; // allow ±0.5 % deviation from 100 %

function validateWeights(holdings: Holding[]): void {
	const total = holdings.reduce((sum, h) => sum + h.targetWeight, 0);
	if (Math.abs(total - 1) > WEIGHT_TOLERANCE) {
		throw new Error(
			`Target weights must sum to 1.0 (currently ${total.toFixed(4)})`,
		);
	}
}

/** Standard rebalance (sell overweight, buy underweight, net cash flow = 0) */

export function rebalance(holdings: Holding[]): RebalanceAction[] {
	validateWeights(holdings);

	const total = holdings.reduce((sum, h) => sum + h.value, 0);

	return holdings.map((h) => {
		const targetValue = total * h.targetWeight;
		const diff = targetValue - h.value;

		return {
			ticker: h.ticker,
			current: h.value,
			target: targetValue,
			action: Math.abs(diff) < 0.005
				? ("hold" as const)
				: diff > 0
					? ("buy" as const)
					: ("sell" as const),
			amount: Math.abs(diff),
		};
	});
}

/** Cashflow-only rebalance (never sell, only buy underweight with new cash) */

export interface CashflowResult {
	actions: RebalanceAction[];
	unallocatedCash: number;
}

export function rebalanceWithCashflow(
	holdings: Holding[],
	cash: number,
): CashflowResult {
	validateWeights(holdings);

	const currentTotal = holdings.reduce((sum, h) => sum + h.value, 0);
	const newTotal = currentTotal + cash;

	const actions: RebalanceAction[] = [];
	let remainingCash = cash;

	for (const h of holdings) {
		const targetValue = newTotal * h.targetWeight;
		const diff = targetValue - h.value;

		// Only buy when underweight; never sell overweight
		if (diff > 0) {
			const buyAmount = Math.min(diff, remainingCash);
			remainingCash -= buyAmount;

			actions.push({
				ticker: h.ticker,
				current: h.value,
				target: targetValue,
				action: buyAmount > 0.005 ? ("buy" as const) : ("hold" as const),
				amount: buyAmount,
			});
		} else {
			// Overweight or on-target — hold as-is
			actions.push({
				ticker: h.ticker,
				current: h.value,
				target: targetValue,
				action: "hold" as const,
				amount: 0,
			});
		}
	}

	return { actions, unallocatedCash: remainingCash };
}
