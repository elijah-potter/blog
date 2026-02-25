import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
	BarDatum,
	drawBarChart,
	LineDatum,
	LineSeries,
	msDay,
} from "../src/github/barChart";

interface TimePoint {
	date: Date;
	users: number;
}

interface ModelResult {
	name: string;
	color: string;
	r2: number;
	confidence: number;
	estimateAtTwoMonths: number;
	line: LineDatum[];
}

interface ForecastState {
	fileName: string;
	points: TimePoint[];
	historicalBars: BarDatum[];
	models: ModelResult[];
	twoMonthDate: Date;
}

type Predictor = (x: number) => number;

const parseUsDate = (value: string): Date | null => {
	const trimmed = value.trim();
	const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
	if (!match) return null;

	const month = Number.parseInt(match[1], 10);
	const day = Number.parseInt(match[2], 10);
	let year = Number.parseInt(match[3], 10);
	if (year < 100) year += 2000;

	const parsed = new Date(Date.UTC(year, month - 1, day));
	if (
		parsed.getUTCFullYear() !== year ||
		parsed.getUTCMonth() !== month - 1 ||
		parsed.getUTCDate() !== day
	) {
		return null;
	}

	return parsed;
};

const parseCsv = (raw: string): TimePoint[] => {
	const lines = raw
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);

	const points: TimePoint[] = [];

	for (const line of lines) {
		const cells = line.split(",").map((cell) => cell.trim());
		if (cells.length < 2) continue;
		if (cells[0].toLowerCase() === "date") continue;

		const date = parseUsDate(cells[0]);
		const users = Number.parseFloat(cells[1]);
		if (!date || !Number.isFinite(users)) continue;

		points.push({ date, users });
	}

	return points.sort((a, b) => a.date.getTime() - b.date.getTime());
};

const clamp = (value: number, min: number, max: number): number =>
	Math.min(max, Math.max(min, value));

const computeR2 = (xs: number[], ys: number[], predict: Predictor): number => {
	if (xs.length !== ys.length || xs.length === 0) return Number.NaN;

	const yMean = ys.reduce((sum, y) => sum + y, 0) / ys.length;
	let ssRes = 0;
	let ssTot = 0;

	for (let i = 0; i < xs.length; i += 1) {
		const residual = ys[i] - predict(xs[i]);
		ssRes += residual * residual;

		const centered = ys[i] - yMean;
		ssTot += centered * centered;
	}

	if (ssTot === 0) return ssRes === 0 ? 1 : 0;
	return 1 - ssRes / ssTot;
};

const fitLinear = (
	xs: number[],
	ys: number[],
): { predictor: Predictor; r2: number } | null => {
	if (xs.length < 2 || ys.length < 2 || xs.length !== ys.length) return null;

	let sumX = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumX2 = 0;

	for (let i = 0; i < xs.length; i += 1) {
		sumX += xs[i];
		sumY += ys[i];
		sumXY += xs[i] * ys[i];
		sumX2 += xs[i] * xs[i];
	}

	const n = xs.length;
	const denominator = n * sumX2 - sumX * sumX;
	if (denominator === 0) return null;

	const slope = (n * sumXY - sumX * sumY) / denominator;
	const intercept = (sumY - slope * sumX) / n;
	const predictor: Predictor = (x) => slope * x + intercept;

	return { predictor, r2: computeR2(xs, ys, predictor) };
};

const solve3x3 = (matrix: number[][], vector: number[]): number[] | null => {
	const augmented = matrix.map((row, rowIndex) => [...row, vector[rowIndex]]);

	for (let col = 0; col < 3; col += 1) {
		let pivotRow = col;
		for (let row = col + 1; row < 3; row += 1) {
			if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivotRow][col])) {
				pivotRow = row;
			}
		}

		if (Math.abs(augmented[pivotRow][col]) < 1e-12) return null;

		if (pivotRow !== col) {
			const tmp = augmented[col];
			augmented[col] = augmented[pivotRow];
			augmented[pivotRow] = tmp;
		}

		const pivot = augmented[col][col];
		for (let j = col; j < 4; j += 1) {
			augmented[col][j] /= pivot;
		}

		for (let row = 0; row < 3; row += 1) {
			if (row === col) continue;
			const factor = augmented[row][col];
			for (let j = col; j < 4; j += 1) {
				augmented[row][j] -= factor * augmented[col][j];
			}
		}
	}

	return [augmented[0][3], augmented[1][3], augmented[2][3]];
};

const fitQuadratic = (
	xs: number[],
	ys: number[],
): { predictor: Predictor; r2: number } | null => {
	if (xs.length < 3 || ys.length < 3 || xs.length !== ys.length) return null;

	let sumX = 0;
	let sumX2 = 0;
	let sumX3 = 0;
	let sumX4 = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumX2Y = 0;

	for (let i = 0; i < xs.length; i += 1) {
		const x = xs[i];
		const y = ys[i];
		const x2 = x * x;

		sumX += x;
		sumX2 += x2;
		sumX3 += x2 * x;
		sumX4 += x2 * x2;
		sumY += y;
		sumXY += x * y;
		sumX2Y += x2 * y;
	}

	const coeffs = solve3x3(
		[
			[sumX4, sumX3, sumX2],
			[sumX3, sumX2, sumX],
			[sumX2, sumX, xs.length],
		],
		[sumX2Y, sumXY, sumY],
	);

	if (!coeffs) return null;

	const [a, b, c] = coeffs;
	const predictor: Predictor = (x) => a * x * x + b * x + c;
	return { predictor, r2: computeR2(xs, ys, predictor) };
};

const fitExponential = (
	xs: number[],
	ys: number[],
): { predictor: Predictor; r2: number } | null => {
	if (xs.length < 2 || ys.length < 2 || xs.length !== ys.length) return null;
	if (ys.some((y) => y <= 0)) return null;

	const transformed = ys.map((y) => Math.log(y));
	const linear = fitLinear(xs, transformed);
	if (!linear) return null;

	const predictor: Predictor = (x) => Math.exp(linear.predictor(x));
	return { predictor, r2: computeR2(xs, ys, predictor) };
};

const buildProjectionLine = (
	startDate: Date,
	endDate: Date,
	predictor: Predictor,
): LineDatum[] => {
	const points: LineDatum[] = [];
	for (let ts = startDate.getTime(); ts <= endDate.getTime(); ts += msDay) {
		const date = new Date(ts);
		const x = Math.round((ts - startDate.getTime()) / msDay);
		points.push({
			date,
			value: Math.max(0, predictor(x)),
		});
	}

	return points;
};

const buildForecastState = (
	fileName: string,
	points: TimePoint[],
): ForecastState => {
	if (points.length < 3) {
		throw new Error("CSV needs at least 3 valid rows to fit all models.");
	}

	const startDate = points[0].date;
	const lastDate = points[points.length - 1].date;
	const twoMonthDate = new Date(lastDate);
	twoMonthDate.setUTCMonth(twoMonthDate.getUTCMonth() + 2);

	const xs = points.map((point) =>
		Math.round((point.date.getTime() - startDate.getTime()) / msDay),
	);
	const ys = points.map((point) => point.users);

	const modelDefs: {
		name: string;
		color: string;
		fit: (
			xVals: number[],
			yVals: number[],
		) => { predictor: Predictor; r2: number } | null;
	}[] = [
		{ name: "Linear", color: "#2563eb", fit: fitLinear },
		{ name: "Quadratic", color: "#dc2626", fit: fitQuadratic },
		{ name: "Exponential", color: "#16a34a", fit: fitExponential },
	];

	const targetX = Math.round(
		(twoMonthDate.getTime() - startDate.getTime()) / msDay,
	);

	const models: ModelResult[] = modelDefs
		.map((model) => {
			const fitted = model.fit(xs, ys);
			if (!fitted) return null;

			const confidence = clamp(fitted.r2, 0, 1) * 100;
			return {
				name: model.name,
				color: model.color,
				r2: fitted.r2,
				confidence,
				estimateAtTwoMonths: Math.max(0, fitted.predictor(targetX)),
				line: buildProjectionLine(startDate, twoMonthDate, fitted.predictor),
			};
		})
		.filter((model): model is ModelResult => model !== null);

	if (!models.length) {
		throw new Error("Unable to fit any model. Check CSV values.");
	}

	const historicalBars = points.map((point) => ({
		tag: point.date.toISOString().split("T")[0],
		start: point.date,
		end: new Date(point.date.getTime() + msDay),
		rate: point.users,
	}));

	return {
		fileName,
		points,
		historicalBars,
		models,
		twoMonthDate,
	};
};

const numberFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 2,
});

const UserForecastPage: React.FC = () => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const [status, setStatus] = useState<string>(
		"Drop a CSV to generate forecasts.",
	);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [forecast, setForecast] = useState<ForecastState | null>(null);

	const handleFile = async (file: File): Promise<void> => {
		setStatus(`Reading ${file.name}…`);

		try {
			const raw = await file.text();
			const points = parseCsv(raw);
			if (!points.length) {
				throw new Error(
					"No valid rows found. Expected columns: Date, Weekly users.",
				);
			}

			const nextForecast = buildForecastState(file.name, points);
			setForecast(nextForecast);
			setStatus("");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to parse file.";
			setForecast(null);
			setStatus(message);
		}
	};

	useEffect(() => {
		if (!window.d3 || !svgRef.current || !forecast) return;

		const lines: LineSeries[] = forecast.models.map((model) => ({
			name: model.name,
			data: model.line,
			color: model.color,
			width: 2,
		}));

		drawBarChart(svgRef.current, forecast.historicalBars, {
			axisLabel: "Weekly users",
			barClass:
				"fill-gray-300 hover:fill-gray-400 transition-colors duration-150",
			lineSeries: lines,
			tooltipFormatter: (datum: BarDatum) =>
				`${datum.tag}\n${numberFormatter.format(datum.rate)} users`,
		});
	}, [forecast]);

	return (
		<>
			<Script
				src="https://cdn.jsdelivr.net/npm/d3@7"
				strategy="beforeInteractive"
			/>

			<div className="max-w-5xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-semibold tracking-tight mb-3">
					User Forecast
				</h1>
				<p className="text-sm text-gray-700 mb-6">
					Upload a CSV with columns <strong>Date</strong> and{" "}
					<strong>Weekly users</strong>. We will fit linear, quadratic, and
					exponential curves and project them 2 months past your latest data
					point.
				</p>

				<div
					onDragOver={(event) => {
						event.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={(event) => {
						event.preventDefault();
						setIsDragging(false);
					}}
					onDrop={(event) => {
						event.preventDefault();
						setIsDragging(false);
						const file = event.dataTransfer.files?.[0];
						if (file) void handleFile(file);
					}}
					className={`mb-6 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
						isDragging
							? "border-blue-500 bg-blue-50"
							: "border-gray-300 bg-gray-50"
					}`}
				>
					<label className="cursor-pointer block">
						<input
							type="file"
							accept=".csv,text/csv"
							className="hidden"
							onChange={(event) => {
								const file = event.target.files?.[0];
								if (file) void handleFile(file);
							}}
						/>
						<div className="text-lg font-medium">Drop CSV file here</div>
						<div className="text-sm text-gray-600 mt-2">
							or click to select one
						</div>
					</label>
				</div>

				{status && <p className="mb-4 text-sm italic">{status}</p>}

				{forecast && (
					<>
						<div className="rounded-lg border border-gray-200 shadow-sm p-4">
							<svg ref={svgRef} className="w-full h-[420px]" />
							<div className="mt-4 text-sm text-gray-700 flex flex-wrap gap-4">
								<span className="flex items-center gap-2">
									<span className="inline-block w-3 h-3 bg-gray-300 rounded-sm" />
									Observed data
								</span>
								{forecast.models.map((model) => (
									<span key={model.name} className="flex items-center gap-2">
										<span
											className="inline-block w-6 h-0.5"
											style={{ backgroundColor: model.color }}
										/>
										{model.name} fit
									</span>
								))}
							</div>
						</div>

						<div className="mt-6 overflow-x-auto">
							<h2 className="text-xl font-semibold mb-2">
								Fit Confidence and 2-Month Estimate
							</h2>
							<p className="text-sm text-gray-700 mb-3">
								Forecast target date:{" "}
								<strong>
									{forecast.twoMonthDate.toISOString().split("T")[0]}
								</strong>
							</p>
							<table className="min-w-full border border-gray-200 text-sm">
								<thead className="bg-gray-100">
									<tr>
										<th className="text-left p-2 border-b border-gray-200">
											Model
										</th>
										<th className="text-left p-2 border-b border-gray-200">
											Confidence
										</th>
										<th className="text-left p-2 border-b border-gray-200">
											R²
										</th>
										<th className="text-left p-2 border-b border-gray-200">
											Estimated users at 2 months
										</th>
									</tr>
								</thead>
								<tbody>
									{forecast.models.map((model) => (
										<tr key={model.name}>
											<td className="p-2 border-b border-gray-200">
												{model.name}
											</td>
											<td className="p-2 border-b border-gray-200">
												{percentFormatter.format(model.confidence)}%
											</td>
											<td className="p-2 border-b border-gray-200">
												{model.r2.toFixed(4)}
											</td>
											<td className="p-2 border-b border-gray-200">
												{numberFormatter.format(
													Math.round(model.estimateAtTwoMonths),
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="mt-6 text-sm text-gray-700">
							Loaded <strong>{forecast.points.length}</strong> rows from{" "}
							<strong>{forecast.fileName}</strong>.
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default UserForecastPage;
