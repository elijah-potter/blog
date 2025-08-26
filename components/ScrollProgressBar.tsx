import { useEffect, useState } from "react";

export default function ScrollProgressBar({
	heightClass = "h-1",
	colorClass = "bg-black",
	className = "",
}: {
	heightClass?: string;
	colorClass?: string;
	className?: string;
}) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const doc = document.documentElement;
			const scrollTop = window.scrollY || doc.scrollTop || 0;
			const scrollable = Math.max(doc.scrollHeight - doc.clientHeight, 0);
			const pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
			setProgress(pct);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, []);

	return (
		<div
			className={`fixed top-0 left-0 right-0 z-50 bg-transparent ${heightClass} ${className}`}
			aria-hidden
		>
			<div
				className={`h-full ${colorClass} transition-[width] duration-100 ease-out`}
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
