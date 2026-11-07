import { transferSchema } from "$lib/api/schemas";
import { northwind, apiFailure, apiResponse, configured } from "$lib/server/northwind";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, params }) => {
	if (!configured()) return apiFailure(503);

	const response = await northwind(
		`/external/transfers/${encodeURIComponent(params.id)}`,
		transferSchema,
		fetch,
	);

	return apiResponse(response);
};
