export function downloadUint8Array(array: Uint8Array, filename: string) {
	const blob = new Blob([array]);

	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}

export function clampText(text: string, length: number): string {
	if (text.length <= length) {
		return text;
	}

	const clamped = text.substring(0, length - 3);

	return `${clamped}...`;
}
