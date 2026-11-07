export { default as Badge } from "./badge.svelte";
export type Variant = "default" | "secondary" | "destructive" | "outline";
export const badgeVariants = ({
	variant = "default",
	className = "",
}: { variant?: Variant; className?: string | null } = {}) =>
	["ui-badge", `ui-badge--${variant}`, className].filter(Boolean).join(" ");
