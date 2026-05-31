import type { Holding } from "./rebalance";

/**
 * Serialize holdings into a URL-safe string.
 * @param holdings - The portfolio holdings to encode.
 * @returns A pipe-delimited string, e.g. "VTI:5400:54|VXUS:3600:36".
 */
export function encodeHoldings(holdings: Holding[]): string {
	return holdings
		.map(
			(h) =>
				`${h.ticker}:${h.value}:${parseFloat((h.targetWeight * 100).toFixed(2))}`,
		)
		.join("|");
}

/**
 * Deserialize a pipe-delimited holdings string.
 * @param raw - The URL string to decode.
 * @returns An array of holdings, or null if the input is empty or invalid.
 */
export function decodeHoldings(raw: string): Holding[] | null {
	if (!raw) return null;
	const result: Holding[] = [];
	for (const entry of raw.split("|")) {
		const parts = entry.split(":");
		if (parts.length !== 3) continue;
		const ticker = parts[0];
		const value = Number.parseFloat(parts[1]);
		const weight = Number.parseFloat(parts[2]) / 100;
		if (!ticker || !Number.isFinite(value) || !Number.isFinite(weight))
			continue;
		result.push({ ticker, value, targetWeight: weight });
	}
	return result.length > 0 ? result : null;
}
