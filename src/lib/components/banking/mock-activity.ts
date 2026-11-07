import cart from "$lib/assets/shopping-cart.svg";
import briefcase from "$lib/assets/briefcase.svg";
import coffee from "$lib/assets/hot-beverage.svg";
import money from "$lib/assets/money-bag.svg";
import bank from "$lib/assets/bank.svg";
import type { Activity } from "./data";
export const mockActivity: Activity[] = [
	{
		id: "grocery",
		name: "Grocery Store",
		detail: "Dec 14 \u00b7 Everyday Checking",
		amount: -82.45,
		icon: cart,
	},
	{
		id: "salary",
		name: "Salary Deposit",
		detail: "Dec 13 \u00b7 Everyday Checking",
		amount: 2800,
		icon: briefcase,
	},
	{
		id: "coffee",
		name: "Coffee Shop",
		detail: "Dec 12 \u00b7 Rewards Credit",
		amount: -5.75,
		icon: coffee,
	},
	{
		id: "interest",
		name: "Interest Payment",
		detail: "Dec 1 \u00b7 High-Yield Savings",
		amount: 5.24,
		icon: money,
	},
	{
		id: "transfer",
		name: "Transfer to Savings",
		detail: "Dec 10 \u00b7 Internal transfer",
		amount: -250,
		icon: bank,
	},
];
