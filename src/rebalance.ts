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

	// Compute each holding's target and deficit (positive = underweight)
	const computed = holdings.map((h) => {
		const targetValue = newTotal * h.targetWeight;
		const diff = targetValue - h.value;
		return { ticker: h.ticker, value: h.value, targetValue, diff };
	});

	const positiveDiffs = computed
		.map((c) => c.diff)
		.filter((d) => d > 0.005);
	const totalDeficit = positiveDiffs.reduce((s, d) => s + d, 0);

	let unallocated = 0;

	const actions: RebalanceAction[] = computed.map(
		({ ticker, value, targetValue, diff }) => {
			// On-target or overweight — hold
			if (diff <= 0.005) {
				return {
					ticker,
					current: value,
					target: targetValue,
					action: "hold" as const,
					amount: 0,
				};
			}

			// Underweight — allocate proportional to deficit, capped at the deficit
			const buyAmount =
				totalDeficit > 0 ? Math.min(diff, (cash * diff) / totalDeficit) : 0;

			return {
				ticker,
				current: value,
				target: targetValue,
				action: buyAmount > 0.005 ? ("buy" as const) : ("hold" as const),
				amount: buyAmount,
			};
		},
	);

	if (cash <= totalDeficit) {
		unallocated = 0;
	} else {
		unallocated = cash - totalDeficit;
	}

	return { actions, unallocatedCash: unallocated };
}
