import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
	type CashflowResult,
	type Holding,
	type RebalanceAction,
	rebalance,
	rebalanceWithCashflow,
} from "../src/rebalance";
import { decodeHoldings, encodeHoldings } from "../src/rebalanceUrl";

/**
 * Format a number as US currency.
 * @param n - The dollar amount to format.
 */
function fmt(n: number): string {
	return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/**
 * Format a 0–1 ratio as a percentage string with one decimal place.
 * @param w - The ratio (e.g. 0.54 for 54%).
 */
function pct(w: number): string {
	return `${(w * 100).toFixed(1)}%`;
}

const DEFAULT_HOLDINGS: Holding[] = [
	{ ticker: "VTI", value: 5400, targetWeight: 0.54 },
	{ ticker: "VXUS", value: 3600, targetWeight: 0.36 },
	{ ticker: "BND", value: 1000, targetWeight: 0.1 },
];

type Mode = "standard" | "cashflow";

export default function RebalancePage() {
	const router = useRouter();
	const initializedRef = useRef(false);

	const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS);
	const [mode, setMode] = useState<Mode>("standard");
	const [cash, setCash] = useState<number>(1000);

	useEffect(() => {
		if (!router.isReady || initializedRef.current) return;
		initializedRef.current = true;

		const { h, mode: m, cash: c } = router.query;

		const decoded = decodeHoldings(h as string);
		if (decoded) setHoldings(decoded);
		if (m === "cashflow") setMode("cashflow");
		if (typeof c === "string" && Number.isFinite(Number(c))) setCash(Number(c));
	}, [router.isReady, router.query]);

	useEffect(() => {
		if (!initializedRef.current) return;

		const params = new URLSearchParams();
		params.set("h", encodeHoldings(holdings));
		if (mode === "cashflow") params.set("mode", "cashflow");
		if (mode === "cashflow" && cash > 0) params.set("cash", cash.toString());

		router.replace(`/rebalance?${params.toString()}`, undefined, {
			shallow: true,
		});
	}, [holdings, mode, cash]);

	const weightSum = holdings.reduce((s, h) => s + h.targetWeight, 0);
	const weightsOk = Math.abs(weightSum - 1) < 0.005;

	let standardResult: RebalanceAction[] | null = null;
	let cashflowResult: CashflowResult | null = null;

	try {
		if (weightsOk) {
			standardResult = rebalance(holdings);
			cashflowResult = rebalanceWithCashflow(holdings, cash);
		}
	} catch {}

	const activeResult =
		mode === "standard" ? standardResult : (cashflowResult?.actions ?? null);

	const totalBuys =
		activeResult?.reduce(
			(s, a) => (a.action === "buy" ? s + a.amount : s),
			0,
		) ?? 0;
	const totalSells =
		activeResult?.reduce(
			(s, a) => (a.action === "sell" ? s + a.amount : s),
			0,
		) ?? 0;
	const portfolioTotal = holdings.reduce((s, h) => s + h.value, 0);
	const resultTotal =
		mode === "cashflow" ? portfolioTotal + cash : portfolioTotal;

	const update = (index: number, field: keyof Holding, raw: string) => {
		setHoldings((prev) =>
			prev.map((h, i) => {
				if (i !== index) return h;
				if (field === "ticker") return { ...h, ticker: raw };
				const num = Number.parseFloat(raw);
				return { ...h, [field]: Number.isFinite(num) ? num : 0 };
			}),
		);
	};

	const addRow = () =>
		setHoldings((prev) => [...prev, { ticker: "", value: 0, targetWeight: 0 }]);

	const removeRow = (index: number) =>
		setHoldings((prev) => prev.filter((_, i) => i !== index));

	return (
		<>
			<Head>
				<meta
					name="description"
					content="Boglehead portfolio rebalancing calculator — compute buys and sells to match your target asset allocation, with a cashflow-only mode that avoids selling."
				/>
			</Head>

			<div className="max-w-5xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-semibold tracking-tight mb-6">
					Portfolio Rebalancer
				</h1>

				<table className="w-full text-left border-collapse mb-4">
					<thead>
						<tr className="border-b border-gray-300">
							<th className="py-2 pr-2">Ticker</th>
							<th className="py-2 pr-2">Current $</th>
							<th className="py-2 pr-2">Target Weight</th>
							<th className="py-2" />
						</tr>
					</thead>
					<tbody>
						{holdings.map((h, i) => (
							<tr key={i} className="border-b border-gray-100">
								<td className="py-1 pr-2">
									<input
										type="text"
										value={h.ticker}
										onChange={(e) => update(i, "ticker", e.target.value)}
										className="w-full border border-gray-300 rounded px-2 py-1 bg-transparent"
										placeholder="VTI"
									/>
								</td>
								<td className="py-1 pr-2">
									<input
										type="number"
										value={h.value || ""}
										onChange={(e) => update(i, "value", e.target.value)}
										className="w-full border border-gray-300 rounded px-2 py-1 bg-transparent"
										min="0"
										step="100"
										placeholder="0"
									/>
								</td>
								<td className="py-1 pr-2">
									<div className="flex items-center gap-1">
										<input
											type="number"
											value={
												h.targetWeight ? +(h.targetWeight * 100).toFixed(2) : ""
											}
											onChange={(e) =>
												update(
													i,
													"targetWeight",
													(Number.parseFloat(e.target.value) / 100).toString(),
												)
											}
											className="w-20 border border-gray-300 rounded px-2 py-1 bg-transparent"
											min="0"
											max="100"
											step="1"
											placeholder="0"
										/>
										<span className="text-sm text-gray-500">%</span>
									</div>
								</td>
								<td className="py-1">
									<button
										type="button"
										onClick={() => removeRow(i)}
										className="text-red-500 hover:text-red-700 text-sm"
										aria-label={`Remove ${h.ticker || "row"}`}
									>
										✕
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="flex items-center gap-4 mb-6">
					<button
						type="button"
						onClick={addRow}
						className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
					>
						+ Add Holding
					</button>
					<span
						className={`text-sm ${weightsOk ? "text-green-600" : "text-red-500"}`}
					>
						Weight total: {pct(weightSum)}
						{weightsOk ? " ✓" : " — must equal 100%"}
					</span>
				</div>

				<div className="flex items-center gap-4 mb-6">
					<label className="flex items-center gap-1 text-sm cursor-pointer">
						<input
							type="radio"
							name="mode"
							checked={mode === "standard"}
							onChange={() => setMode("standard")}
						/>
						Sell &amp; Buy
					</label>
					<label className="flex items-center gap-1 text-sm cursor-pointer">
						<input
							type="radio"
							name="mode"
							checked={mode === "cashflow"}
							onChange={() => setMode("cashflow")}
						/>
						Cashflow Only
					</label>
				</div>

				{mode === "cashflow" && (
					<div className="flex items-center gap-2 mb-6">
						<label className="text-sm">New cash:</label>
						<input
							type="number"
							value={cash || ""}
							onChange={(e) => setCash(Number.parseFloat(e.target.value) || 0)}
							className="border border-gray-300 rounded px-2 py-1 bg-transparent w-32"
							min="0"
							step="100"
							placeholder="0"
						/>
					</div>
				)}

				{activeResult && weightsOk ? (
					<div className="rounded-lg border border-gray-200 shadow-sm p-4 mb-8">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-gray-300">
									<th className="py-2 pr-2">Ticker</th>
									<th className="py-2 pr-2 text-right">Current</th>
									<th className="py-2 pr-2 text-right">Current %</th>
									<th className="py-2 pr-2 text-right">Target</th>
									<th className="py-2 pr-2 text-center">Action</th>
									<th className="py-2 text-right">Amount</th>
									<th className="py-2 text-right">Resulting</th>
								</tr>
							</thead>
							<tbody>
								{activeResult.map((a) => (
									<tr
										key={a.ticker || a.current}
										className="border-b border-gray-100"
									>
										<td className="py-2 pr-2 font-medium">{a.ticker}</td>
										<td className="py-2 pr-2 text-right">{fmt(a.current)}</td>
										<td className="py-2 pr-2 text-right tabular-nums">
											{pct(a.current / portfolioTotal)}
										</td>
										<td className="py-2 pr-2 text-right">{fmt(a.target)}</td>
										<td
											className={`py-2 pr-2 text-center font-semibold ${
												a.action === "buy"
													? "text-green-600"
													: a.action === "sell"
														? "text-red-500"
														: "text-gray-400"
											}`}
										>
											{a.action.toUpperCase()}
										</td>
										<td className="py-2 text-right">
											{a.amount > 0.005 ? fmt(a.amount) : "—"}
										</td>
										<td className="py-2 text-right tabular-nums">
											{pct(
												(a.current +
													(a.action === "buy"
														? a.amount
														: a.action === "sell"
															? -a.amount
															: 0)) /
													resultTotal,
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>

						<div className="mt-4 pt-3 border-t border-gray-200 text-sm space-y-1">
							<p>
								Portfolio total: <strong>{fmt(portfolioTotal)}</strong>
								{mode === "cashflow" && (
									<span>
										{" "}
										→ <strong>{fmt(portfolioTotal + cash)}</strong> (after
										cashflow)
									</span>
								)}
							</p>
							{mode === "standard" ? (
								<>
									<p>
										Total buys:{" "}
										<strong className="text-green-600">{fmt(totalBuys)}</strong>
									</p>
									<p>
										Total sells:{" "}
										<strong className="text-red-500">{fmt(totalSells)}</strong>
									</p>
								</>
							) : (
								<>
									<p>
										Total buys:{" "}
										<strong className="text-green-600">{fmt(totalBuys)}</strong>
									</p>
									{cashflowResult && cashflowResult.unallocatedCash > 0.005 && (
										<p>
											Unallocated cash:{" "}
											<strong className="text-yellow-600">
												{fmt(cashflowResult.unallocatedCash)}
											</strong>{" "}
											<span className="text-gray-500">
												(could not deploy — some assets already overweight)
											</span>
										</p>
									)}
								</>
							)}
						</div>
					</div>
				) : (
					<p className="text-sm text-gray-500 italic mb-8">
						Enter holdings and ensure target weights sum to 100% to see
						rebalancing instructions.
					</p>
				)}

				<div className="mt-6 space-y-2">
					<h2 className="text-xl font-semibold">About this calculator</h2>
					<p>
						This tool helps you rebalance a <strong>Boglehead-style</strong>{" "}
						portfolio back to your target asset allocation. Enter each holding's
						ticker symbol, its current dollar value, and your desired target
						weight (as a percentage of the total portfolio).
					</p>
					<p>
						<strong>Sell &amp; Buy</strong> mode computes the exact buys and
						sells needed so that every asset lands at its target weight — sells
						fund buys dollar-for-dollar with zero net cash flow.
					</p>
					<p>
						<strong>Cashflow Only</strong> mode is for when you're contributing
						new money and want to avoid selling. It spreads cash across all
						underweight assets in proportion to how far below target each one
						sits; overweight holdings are left untouched. Any cash that can't be
						deployed (because all assets are at or above target) is reported as
						unallocated.
					</p>
					<p>
						Your settings are saved in the URL automatically — bookmark this
						page to preserve your portfolio configuration.
					</p>
				</div>
			</div>
		</>
	);
}
