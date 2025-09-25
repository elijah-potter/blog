export function clampText(text: string, length: number): string {
	if (text.length <= length) {
		return text;
	}

	const clamped = text.substring(0, length - 3);

	return `${clamped}...`;
}
