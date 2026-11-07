import { json } from "@sveltejs/kit";
import { configured } from "$lib/server/northwind";
import type { RequestHandler } from "./$types";

// Configuration readiness, not an upstream probe on every load-balancer check.
export const GET: RequestHandler = () =>
	json(
		{ status: configured() ? "ready" : "not-ready" },
		{ status: configured() ? 200 : 503, headers: { "Cache-Control": "no-store" } },
	);
