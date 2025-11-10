import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
	BarDatum,
	drawBarChart,
	msDay,
} from "../../../src/github/barChart";

/* ------------------------------------------------------------ *
 *  Types & helpers                                              *
 * ------------------------------------------------------------ */
interface Release {
	tag_name: string;
	published_at: string;
	assets: { name: string; download_count: number }[];
}
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
			if (!svgRef.current) return;
			drawBarChart(svgRef.current, data, {
				axisLabel: "Downloads / day",
				tooltipFormatter: (d: BarDatum) =>
					`${d.tag}\n${d.rate} downloads/day\n` +
					`${d.start.toLocaleDateString()} – ${d.end.toLocaleDateString()}`,
			});
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
				{status && <p className="mb-4 text-sm italic">{status}</p>}

				{/* Chart */}
				<div className="rounded-lg border border-gray-200 shadow-sm p-4">
					<svg ref={svgRef} className="w-full h-[420px]" />
				</div>

				<div className="mt-6 space-y-2">
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
