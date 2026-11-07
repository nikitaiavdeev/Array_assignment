## Developing

Ensure you're using node version ^24.12.0

IMPORTANT NOTE:

This project uses Svelte v4, the legacy docs for this are available [here](https://svelte.dev/docs/svelte/legacy-overview)

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm run build
```

You can preview the production build with `pnpm run preview`.

## API connection

Copy `.env.example` to `.env` and set `NORTHWIND_API_KEY`. The key is read only by SvelteKit server endpoints; browser requests use the same-origin `/api` routes. The upstream API is `https://northwind.dev.array.io`.

All API requests use `src/lib/api/safeFetch.ts` with a `zod/mini` response schema. It checks HTTP status, JSON, response shape, and a deadline covering the response body. Requests are not retried automatically, since a timed-out transfer may already have been processed. Unexpected errors open the shared error dialog. Transfer validation rejections and request failures appear in the transfer dialog. Submission validates, initiates, then polls status GET requests for up to 30 seconds. Pending or unconfirmed transfers are never presented as successful. Recent Activity uses the supplied mock data; Recent transfers stays connected to the API.

Run `pnpm test` for the fetch failure and timeout tests, `pnpm check` for Svelte/TypeScript diagnostics, and `pnpm build` for the production build.

## Code organization

- `src/lib/components/ui`: reusable components styled with plain CSS and the supplied design tokens. Button variant and size classes are separate so neutral buttons never inherit primary colors.
- `src/lib/components/banking`: views and layout-scoped stores. `mappers.ts` converts API responses to display models; `transfer-validation.ts` holds the shared field and submission checks. Drafts survive navigation within the app and clear after a confirmed successful transfer.
- `src/lib/api`: response schemas, bounded JSON requests, and transfer status polling. Only status reads are polled; transfer initiation is never retried automatically.
- `src/lib/server/northwind.ts`: authenticated upstream requests, complete account loading, and consistent private responses. API routes recheck balances and account status before validation and initiation.

Use `pnpm lint` before submitting changes. Keep components compatible with Svelte 4; Svelte 5 runes and newer SvelteKit routing helpers are not supported by this project.

## Delivery and production assessment

Run `pnpm verify` for the complete local quality gate. `pnpm build` produces a standalone Node server; `pnpm start` runs it with secrets injected by the environment. See [production readiness](./docs/production-readiness.md) for deployment settings, horizontal scaling behavior, support procedures, and outstanding public-release gates. The current single-integration demo is not approved for public banking use: user authentication/authorization, durable idempotency/reconciliation, dependency remediation, and load validation remain required.
