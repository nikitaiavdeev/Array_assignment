export type Account = {
	id: string;
	name: string;
	number: string;
	balance: number;
	kind: string;
	status: string;
};
export type Activity = { id: string; name: string; detail: string; amount: number; icon: string };
// Formatting runs for every visible balance and activity row.
const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const currency = (value: number) => currencyFormatter.format(value);
