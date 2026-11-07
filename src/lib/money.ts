export function normalizeMoneyInput(input: string): string | null {
	const raw = input.replace(/[$,\s]/g, "");
	if (!/^-?\d*(?:\.\d{0,2})?$/.test(raw)) return null;
	const [integer, fraction] = raw.split(".");
	const normalized = integer.replace(/^(-?)0+(?=\d)/, "$1");
	return fraction === undefined
		? normalized
		: `${normalized === "" ? "0" : normalized === "-" ? "-0" : normalized}.${fraction}`;
}
export function formatMoneyInput(value: string): string {
	const [integer, fraction] = value.split(".");
	const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}
