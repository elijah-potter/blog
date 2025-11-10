import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
	BarDatum,
	drawBarChart,
	msDay,
	LineDatum,
} from "../../src/github/barChart";

interface SearchItem {
	id: number;
	created_at: string;
	pull_request?: object;
}

interface SearchResponse {
	items: SearchItem[];
}

const lookbackDays = 120;
const maxPages = 10;
const perPage = 100;
const movingAverageWindow = 7;

const formatDay = (date: Date): string => date.toISOString().split("T")[0];

const startOfUTCDay = (date: Date): Date => {
	const d = new Date(date);
	d.setUTCHours(0, 0, 0, 0);
	return d;
};

const buildDailySeries = (
	counts: Map<string, number>,
	since: Date,
	until: Date,
): BarDatum[] => {
	const results: BarDatum[] = [];
	for (let ts = since.getTime(); ts <= until.getTime(); ts += msDay) {
		const start = new Date(ts);
		const dayKey = start.toISOString().split("T")[0];
		results.push({
			tag: dayKey,
			start,
			end: new Date(ts + msDay),
			rate: counts.get(dayKey) ?? 0,
		});
	}
	return results;
};

const computeMovingAverage = (
	series: BarDatum[],
	windowSize = movingAverageWindow,
): LineDatum[] => {
	const window: number[] = [];
	let sum = 0;
	const avg: LineDatum[] = [];

	for (const day of series) {
		window.push(day.rate);
		sum += day.rate;
		if (window.length > windowSize) {
			const removed = window.shift();
			sum -= removed ?? 0;
		}
		const value = +(sum / window.length).toFixed(2);
		avg.push({
			date: new Date(day.start),
			value,
		});
	}

	return avg;
};

const PRGraph: React.FC = () => {
	const router = useRouter();
	const { username } = router.query as { username?: string };

	const svgRef = useRef<SVGSVGElement | null>(null);
	const [status, setStatus] = useState<string>("Loading…");

	useEffect(() => {
		if (!username) return;
		if (!window.d3 || !svgRef.current) return;

		const fetchData = async (): Promise<{
			bars: BarDatum[];
			line: LineDatum[];
		}> => {
			const since = startOfUTCDay(new Date(Date.now() - lookbackDays * msDay));
			const until = startOfUTCDay(new Date());
			const counts = new Map<string, number>();
			let page = 1;

			while (page <= maxPages) {
				setStatus(
					`Fetching PRs for ${username} (page ${page}/${maxPages})…`,
				);

				const query = [
					"type:pr",
					`author:${username}`,
					`created:>=${formatDay(since)}`,
				].join(" ");

				const url = `https://api.github.com/search/issues?q=${encodeURIComponent(
					query,
				)}&per_page=${perPage}&page=${page}&sort=created&order=desc`;

				const res = await fetch(url, {
					headers: {
						Accept: "application/vnd.github+json",
					},
				});

				if (!res.ok) {
					throw new Error(`GitHub API error ${res.status}`);
				}

				const body = (await res.json()) as SearchResponse;
				if (!body.items.length) break;

				body.items.forEach((item) => {
					if (!item.pull_request) return;
					const day = item.created_at.slice(0, 10);
					counts.set(day, (counts.get(day) ?? 0) + 1);
				});

				if (body.items.length < perPage) break;
				page += 1;
			}

			const bars = buildDailySeries(counts, since, until);
			const line = computeMovingAverage(bars);
			return { bars, line };
		};

		const draw = ({
			bars,
			line,
		}: {
			bars: BarDatum[];
			line: LineDatum[];
		}) => {
			if (!svgRef.current) return;

			const totalPRs = bars.reduce((sum, day) => sum + day.rate, 0);
			setStatus(
				totalPRs
					? ""
					: `No pull requests found for ${username} in the last ${lookbackDays} days.`,
			);

			drawBarChart(svgRef.current, bars, {
				axisLabel: "PRs / day",
				barClass:
					"fill-emerald-500 hover:fill-emerald-600 transition-colors duration-150",
				lineData: line,
				lineColor: "#7c3aed",
				lineWidth: 2,
				tooltipFormatter: (d: BarDatum) =>
					`${d.tag}\n${d.rate} PRs opened\n${d.start.toLocaleDateString()}`,
			});
		};

		fetchData()
			.then(draw)
			.catch((err) => {
				setStatus(err.message);
				console.error(err);
			});
	}, [username]);

	return (
		<>
			<Script
				src="https://cdn.jsdelivr.net/npm/d3@7"
				strategy="beforeInteractive"
			/>

			<div className="max-w-5xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<h1 className="text-2xl font-semibold tracking-tight">
							{username
								? `${username}'s PR velocity`
								: "Loading username…"}
						</h1>
					</div>
				</div>

				{status && <p className="mb-4 text-sm italic">{status}</p>}

				<div className="rounded-lg border border-gray-200 shadow-sm p-4">
					<svg ref={svgRef} className="w-full h-[420px]" />
					<div className="mt-4 text-sm text-gray-600 flex flex-wrap gap-4">
						<span className="flex items-center gap-2">
							<span className="inline-block w-3 h-3 bg-emerald-500 rounded-sm" />
							Daily PR count
						</span>
						<span className="flex items-center gap-2">
							<span className="inline-block w-6 h-0.5 bg-purple-600" />
							{movingAverageWindow}-day moving average
						</span>
					</div>
				</div>

				<div className="mt-6 space-y-2">
					<h2 className="text-xl font-semibold">About this chart</h2>
					<p>
						This visualization counts{" "}
						<strong>pull requests authored per day</strong> over the last{" "}
						{lookbackDays} days using GitHub's search API. It caps at{" "}
						{maxPages * perPage} PRs because of GitHub's result limits.
					</p>
					<p>
						A {movingAverageWindow}-day moving average line helps reveal
						underlying trends by smoothing daily noise. Hover a bar to see the
						exact day and how many PRs landed.
					</p>
				</div>
			</div>
		</>
	);
};

export default PRGraph;
