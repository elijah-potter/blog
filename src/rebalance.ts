export interface Holding {
	ticker: string;
	value: number;
	targetWeight: number;
}

export interface RebalanceAction {
	ticker: string;
	current: number;
	target: number;
	action: "buy" | "sell" | "hold";
	amount: number;
}

const WEIGHT_TOLERANCE = 0.005;

/**
 * Validate that target weights sum to 1.0.
 * @param holdings - The portfolio holdings to validate.
 * @throws {Error} If the total deviates from 1.0 by more than WEIGHT_TOLERANCE.
 */
function validateWeights(holdings: Holding[]): void {
	const total = holdings.reduce((sum, h) => sum + h.targetWeight, 0);
	if (Math.abs(total - 1) > WEIGHT_TOLERANCE) {
		throw new Error(
			`Target weights must sum to 1.0 (currently ${total.toFixed(4)})`,
		);
	}
}

/**
 * Standard rebalance: sell overweight holdings to fund buys, net cash flow = 0.
 * @param holdings - The current portfolio holdings with target weights.
 * @returns An action per holding (buy, sell, or hold).
 */
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
			action:
				Math.abs(diff) < WEIGHT_TOLERANCE
					? ("hold" as const)
					: diff > 0
						? ("buy" as const)
						: ("sell" as const),
			amount: Math.abs(diff),
		};
	});
}

export interface CashflowResult {
	actions: RebalanceAction[];
	unallocatedCash: number;
}

/**
 * Cashflow-only rebalance: deploy new cash into underweight holdings without selling.
 * @param holdings - The current portfolio holdings with target weights.
 * @param cash - The amount of new cash to deploy.
 * @returns The actions to take and any unallocated cash that could not be deployed.
 */
export function rebalanceWithCashflow(
	holdings: Holding[],
	cash: number,
): CashflowResult {
	validateWeights(holdings);

	const currentTotal = holdings.reduce((sum, h) => sum + h.value, 0);
	const newTotal = currentTotal + cash;

	const computed = holdings.map((h) => {
		const targetValue = newTotal * h.targetWeight;
		const diff = targetValue - h.value;
		return { ticker: h.ticker, value: h.value, targetValue, diff };
	});

	const positiveDiffs = computed
		.map((c) => c.diff)
		.filter((d) => d > WEIGHT_TOLERANCE);
	const totalDeficit = positiveDiffs.reduce((s, d) => s + d, 0);

	let unallocated = 0;

	const actions: RebalanceAction[] = computed.map(
		({ ticker, value, targetValue, diff }) => {
			if (diff <= WEIGHT_TOLERANCE) {
				return {
					ticker,
					current: value,
					target: targetValue,
					action: "hold" as const,
					amount: 0,
				};
			}

			const buyAmount =
				totalDeficit > 0 ? Math.min(diff, (cash * diff) / totalDeficit) : 0;

			return {
				ticker,
				current: value,
				target: targetValue,
				action:
					buyAmount > WEIGHT_TOLERANCE ? ("buy" as const) : ("hold" as const),
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
