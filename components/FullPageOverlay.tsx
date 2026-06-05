import type { ReactNode } from "react";

interface FullPageOverlayProps {
	children: ReactNode;
	className?: string;
}

const FullPageOverlay: React.FC<FullPageOverlayProps> = ({
	children,
	className = "",
}) => {
	return (
		<div className={`fixed inset-0 z-50 overflow-auto bg-white ${className}`}>
			{children}
		</div>
	);
};

export default FullPageOverlay;
