import { randomUUID } from "node:crypto";
import type { Handle, HandleServerError } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	// Generate our own ID; do not trust arbitrary client values in operational logs.
	event.locals.requestId = randomUUID();
	const started = performance.now();
	const response = await resolve(event);
	response.headers.set("X-Request-ID", event.locals.requestId);
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "same-origin");
	if (event.url.pathname.startsWith("/api/")) response.headers.set("Cache-Control", "no-store");
	if (response.status >= 400) {
		// Route templates and status only: no account IDs, credentials, or request bodies.
		console.error(
			JSON.stringify({
				event: "request_failed",
				requestId: event.locals.requestId,
				route: event.route.id,
				method: event.request.method,
				status: response.status,
				durationMs: Math.round(performance.now() - started),
			}),
		);
	}
	return response;
};

export const handleError: HandleServerError = ({ event, error }) => {
	console.error(
		JSON.stringify({
			event: "unhandled_error",
			requestId: event.locals.requestId,
			route: event.route.id,
			errorType: error instanceof Error ? error.name : "Unknown",
			// Omit the exception message, which may contain request data, but retain code locations.
			frames: error instanceof Error ? error.stack?.split("\n").slice(1, 9) : undefined,
		}),
	);
	return {
		message: `Unexpected server error. Contact developers with request ID ${event.locals.requestId}.`,
	};
};
