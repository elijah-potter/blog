import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

/* ------------------------------------------------------------ *
 *  Types & helpers                                              *
 * ------------------------------------------------------------ */
interface Release {
	tag_name: string;
	published_at: string;
	assets: { name: string; download_count: number }[];
}
interface BarDatum {
	tag: string;
	start: Date;
	end: Date;
	rate: number;
}
declare global {
	// D3 is loaded late from a CDN – declare it to keep TS happy
	// eslint-disable-next-line no-var
	var d3: any;
}

const msDay = 24 * 60 * 60 * 1000;

/* ------------------------------------------------------------ *
 *  Component                                                    *
 * ------------------------------------------------------------ */
const DownloadGraph: React.FC = () => {
	const router = useRouter();
	const { owner, repo } = router.query as { owner?: string; repo?: string };

	const svgRef = useRef<SVGSVGElement | null>(null);
	const [status, setStatus] = useState<string>("Loading…");

	useEffect(() => {
		if (!owner || !repo) return; // wait for route params
		if (!window.d3 || !svgRef.current) return; // wait for D3 script + DOM

		const d3 = window.d3 as any;

		/* ---------------- data fetch ---------------- */
		const fetchData = async (): Promise<BarDatum[]> => {
			setStatus(`Fetching ${owner}/${repo}…`);
			const res = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`,
			);
			if (!res.ok) throw new Error(`GitHub API error ${res.status}`);

			const rels: Release[] = await res.json();
			rels.sort(
				(a, b) => +new Date(a.published_at) - +new Date(b.published_at),
			);

			return rels.map((r, i) => {
				const start = new Date(r.published_at);
				const end =
					i < rels.length - 1 ? new Date(rels[i + 1].published_at) : new Date();
				const total = r.assets
					.filter((a) => a.name !== "harper.zip")
					.reduce((s, a) => s + a.download_count, 0);
				const days = Math.max(1, (end.getTime() - start.getTime()) / msDay);
				return {
					tag: r.tag_name,
					start,
					end,
					rate: +(total / days).toFixed(2),
				};
			});
		};

		/* ---------------- draw chart ---------------- */
		const draw = (data: BarDatum[]) => {
			const svg = d3.select(svgRef.current);
			const width = svgRef.current!.clientWidth;
			const height = 420;
			const margin = { top: 20, right: 24, bottom: 60, left: 72 };

			svg.attr("viewBox", `0 0 ${width} ${height}`);

			svg.selectAll("*").remove();

			/* -- scales -- */
			const x = d3
				.scaleTime()
				.domain([
					d3.min(data, (d: BarDatum) => d.start),
					d3.max(data, (d: BarDatum) => d.end),
				])
				.range([margin.left, width - margin.right]);

			const y = d3
				.scaleLinear()
				.domain([0, d3.max(data, (d: BarDatum) => d.rate)])
				.nice()
				.range([height - margin.bottom, margin.top]);

			/* -- bars -- */
			svg
				.append("g")
				.selectAll("rect")
				.data(data)
				.join("rect")
				.attr("x", (d: BarDatum) => x(d.start))
				.attr("width", (d: BarDatum) => Math.max(1, x(d.end) - x(d.start)))
				.attr("y", (d: BarDatum) => y(d.rate))
				.attr("height", (d: BarDatum) => y(0) - y(d.rate))
				.attr(
					"class",
					"fill-sky-500 hover:fill-sky-600 dark:fill-sky-400 transition-colors",
				)
				.append("title")
				.text(
					(d: BarDatum) =>
						`${d.tag}\n${d.rate} downloads/day\n` +
						`${d.start.toLocaleDateString()} – ${d.end.toLocaleDateString()}`,
				);

			/* -- axes -- */
			svg
				.append("g")
				.attr("transform", `translate(0,${height - margin.bottom})`)
				.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
				.selectAll("text")
				.attr("transform", "rotate(-40)")
				.attr("class", "text-xs fill-gray-700 dark:fill-gray-300")
				.style("text-anchor", "end");

			svg
				.append("g")
				.attr("transform", `translate(${margin.left},0)`)
				.call(d3.axisLeft(y).ticks(6))
				.selectAll("text")
				.attr("class", "text-xs fill-gray-700 dark:fill-gray-300");

			/* axis label */
			svg
				.append("text")
				.attr("x", margin.left - 56)
				.attr("y", margin.top - 6)
				.attr("class", "text-sm font-medium fill-gray-800 dark:fill-gray-200")
				.text("Downloads / day");

			setStatus("");
		};

		fetchData()
			.then(draw)
			.catch((err) => {
				setStatus(err.message);
				console.error(err);
			});
	}, [owner, repo]);

	/* ---------------- markup ---------------- */
	return (
		<>
			{/* Load D3 globally */}
			<Script
				src="https://cdn.jsdelivr.net/npm/d3@7"
				strategy="beforeInteractive"
			/>

			<div className="max-w-5xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<h1 className="text-2xl font-semibold tracking-tight">
							{owner && repo ? `${owner}/${repo} download rate` : "Loading…"}
						</h1>
					</div>
				</div>

				{/* Status */}
				{status && (
					<p className="mb-4 text-sm italic text-gray-500 dark:text-gray-400">
						{status}
					</p>
				)}

				{/* Chart */}
				<div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
					<svg ref={svgRef} className="w-full h-[420px]" />
				</div>

				<div className="mt-6 text-gray-700 dark:text-gray-300 space-y-2">
					<h2 className="text-xl font-semibold">About this chart</h2>
					<p>
						This visualization shows{" "}
						<strong>GitHub release downloads/day</strong> for each version,
						based on real data from GitHub's API. Bar <strong>height</strong>{" "}
						represents daily download velocity, while bar <strong>width</strong>{" "}
						spans how long each release was the latest.
					</p>
					<p>
						Use it to quickly gauge adoption, identify impactful releases, and
						better understand your project's momentum over time. Hover over each
						bar to see exact download rates and date ranges.
					</p>
				</div>
			</div>
		</>
	);
};

export default DownloadGraph;
