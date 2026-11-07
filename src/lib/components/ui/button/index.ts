import type { Button as ButtonPrimitive } from "bits-ui";
import Root from "./button.svelte";
type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";
type Props = ButtonPrimitive.Props & { variant?: Variant; size?: Size };
type Events = ButtonPrimitive.Events;
const buttonVariants = ({
	variant = "default",
	size = "default",
	className = "",
}: { variant?: Variant; size?: Size; className?: string | null } = {}) =>
	// Size classes must not collide with variant classes (both have a "default").
	["ui-button", `ui-button--${variant}`, `ui-button--size-${size}`, className]
		.filter(Boolean)
		.join(" ");
export {
	Root,
	Root as Button,
	type Props,
	type Events,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants,
};
