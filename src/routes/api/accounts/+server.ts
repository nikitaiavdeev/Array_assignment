import { apiResponse, apiFailure, configured, fetchAccounts } from "$lib/server/northwind";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch }) => {
	if (!configured()) return apiFailure(503);
	return apiResponse(await fetchAccounts(fetch));
};
