interface Margin {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface BarDatum {
	tag: string;
	start: Date;
	end: Date;
	rate: number;
}

export interface LineDatum {
	date: Date;
	value: number;
}

export interface LineSeries {
	name: string;
	data: LineDatum[];
	color?: string;
	width?: number;
}

export interface DrawBarChartOptions {
	height?: number;
	margin?: Partial<Margin>;
	axisLabel?: string;
	barClass?: string;
	tooltipFormatter?: (datum: BarDatum) => string;
	lineData?: LineDatum[];
	lineColor?: string;
	lineWidth?: number;
	lineSeries?: LineSeries[];
}

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		d3: any;
	}
}

const defaultMargin: Margin = { top: 20, right: 24, bottom: 60, left: 72 };
const defaultBarClass =
	"fill-sky-500 hover:fill-sky-600 transition-colors duration-150";

export const msDay = 24 * 60 * 60 * 1000;

const formatDateRange = (start: Date, end: Date): string =>
	`${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;

export const defaultTooltip = (datum: BarDatum): string =>
	`${datum.tag}\n${datum.rate} / day\n${formatDateRange(datum.start, datum.end)}`;

export const drawBarChart = (
	svgElement: SVGSVGElement,
	data: BarDatum[],
	options: DrawBarChartOptions = {},
): void => {
	if (!window.d3) throw new Error("D3 is not loaded on window");

	const d3 = window.d3;
	const {
		height = 420,
		axisLabel = "Value / day",
		tooltipFormatter,
		lineData,
		lineColor = "#be185d",
		lineWidth = 2,
		lineSeries,
	} = options;
	const margin: Margin = { ...defaultMargin, ...options.margin };
	const barClass = options.barClass ?? defaultBarClass;

	const svg = d3.select(svgElement);
	const width = svgElement.clientWidth || 800;

	svg.attr("viewBox", `0 0 ${width} ${height}`);
	svg.selectAll("*").remove();

	const hasBars = data.length > 0;
	const resolvedLineSeries: LineSeries[] = [];
	if (lineData && lineData.length > 0) {
		resolvedLineSeries.push({
			name: "Line",
			data: lineData,
			color: lineColor,
			width: lineWidth,
		});
	}
	if (lineSeries && lineSeries.length > 0) {
		resolvedLineSeries.push(
			...lineSeries.filter((series) => series.data.length),
		);
	}

	const hasLine = resolvedLineSeries.length > 0;

	if (!hasBars && !hasLine) {
		return;
	}

	const domainDates: Date[] = [];
	if (hasBars) {
		const barStart = d3.min(data, (d: BarDatum) => d.start);
		const barEnd = d3.max(data, (d: BarDatum) => d.end);
		if (barStart) domainDates.push(barStart);
		if (barEnd) domainDates.push(barEnd);
	}
	if (hasLine) {
		for (const series of resolvedLineSeries) {
			const lineStart = d3.min(series.data, (d: LineDatum) => d.date);
			const lineEnd = d3.max(series.data, (d: LineDatum) => d.date);
			if (lineStart) domainDates.push(lineStart);
			if (lineEnd) domainDates.push(lineEnd);
		}
	}

	const domainStart = d3.min(domainDates);
	const domainEnd = d3.max(domainDates);

	if (!domainStart || !domainEnd) {
		return;
	}

	const x = d3
		.scaleTime()
		.domain([domainStart, domainEnd])
		.range([margin.left, width - margin.right]);

	const allValues: number[] = [];
	if (hasBars) allValues.push(...data.map((d: BarDatum) => d.rate));
	if (hasLine) {
		for (const series of resolvedLineSeries) {
			allValues.push(...series.data.map((d: LineDatum) => d.value));
		}
	}

	const maxY = d3.max(allValues) ?? 0;
	const y = d3
		.scaleLinear()
		.domain([0, maxY])
		.nice()
		.range([height - margin.bottom, margin.top]);

	const tooltip = tooltipFormatter ?? defaultTooltip;

	if (hasBars) {
		svg
			.append("g")
			.selectAll("rect")
			.data(data)
			.join("rect")
			.attr("x", (d: BarDatum) => x(d.start))
			.attr("width", (d: BarDatum) => Math.max(1, x(d.end) - x(d.start)))
			.attr("y", (d: BarDatum) => y(d.rate))
			.attr("height", (d: BarDatum) => y(0) - y(d.rate))
			.attr("class", barClass)
			.append("title")
			.text((datum: BarDatum) => tooltip(datum));
	}

	if (hasLine) {
		const line = d3
			.line()
			.x((d: LineDatum) => x(d.date))
			.y((d: LineDatum) => y(d.value))
			.curve(d3.curveMonotoneX);

		for (const series of resolvedLineSeries) {
			svg
				.append("path")
				.datum(series.data)
				.attr("fill", "none")
				.attr("stroke", series.color ?? lineColor)
				.attr("stroke-width", series.width ?? lineWidth)
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("d", line as any);
		}
	}

	svg
		.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
		.selectAll("text")
		.attr("transform", "rotate(-40)")
		.attr("class", "text-xs fill-black")
		.style("text-anchor", "end");

	svg
		.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).ticks(6))
		.selectAll("text")
		.attr("class", "text-xs fill-black");

	svg
		.append("text")
		.attr("x", margin.left - 56)
		.attr("y", margin.top - 6)
		.attr("class", "text-sm font-medium fill-black")
		.text(axisLabel);
};
