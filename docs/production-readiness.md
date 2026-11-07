# Delivery assessment

The assignment's accounts and transfer flows are implemented and checked. This is a single-integration banking demo, **not a public multi-user banking deployment**. The earlier delivery checks established that the app builds and works; they did not establish production security or capacity.

## Requirements and ecosystem

- Accounts and transfer history use schema-validated API responses; Recent Activity uses the supplied fixture because no endpoint exists.
- The transfer sequence is accounts/balance recheck → validate → initiate once → bounded status GET polling. Documented HTTP 400 business rejections are displayed as transfer failures with the bank's explanation.
- UI primitives use Bits UI/shadcn-svelte, Svelte 4 stores scoped to the root layout, and the supplied CSS tokens. Drafts survive navigation within the same app session.
- TypeScript strict mode and Zod Mini validate the browser/server boundary. Node's built-in test runner covers request failures, deadlines, money input, field validation, polling, and server orchestration.
- Node's AbortSignal timeout/composition APIs bound the whole server workflow. No custom timer service, in-process job queue, or cluster-wide memory cache is used.

## Running the built server

Use Node 24.12 or newer within Node 24, `pnpm install --frozen-lockfile`, `pnpm verify`, then `pnpm start`. The pinned Node adapter targets the project's SvelteKit 2 baseline. Do not serve production traffic with Vite dev or preview.

Inject `NORTHWIND_API_KEY` from your secret manager and set `ORIGIN` to the public HTTPS origin, `HOST=0.0.0.0`, `PORT=3000`, `BODY_SIZE_LIMIT=16K`, and `SHUTDOWN_TIMEOUT=45`. Built Node servers do not automatically read `.env`; for local testing only, use `node --env-file=.env build`. Keep development environment files out of delivery archives and container images.

Terminate HTTPS at a trusted ingress. Enforce request/header size limits and global/per-user rate limits there, across all replicas. Do not rely exclusively on the pinned framework's body-size limit (see dependency advisories below). Configure the ingress timeout above the 24-second submission budget; allow 45 seconds for graceful shutdown. Browser submissions allow 30 seconds; upstream calls allow at most 8 seconds each within the shared server budget. Account-list reads have a shared 10-second budget. Client status polling backs off to 5-second intervals and stops after 30 seconds.

`GET /healthz` returns 200 when the upstream credential is configured and 503 otherwise. It does not call the bank and does not prove upstream availability. Monitor upstream failures separately. Failed requests carry an `X-Request-ID`; structured logs use route templates and error categories without credentials, account details, or request bodies. Forward these logs to centralized storage and alert on sustained upstream errors/timeouts and failed readiness checks.

## Horizontal scaling and transfer guarantees

Application replicas are stateless: there are no server-global customer stores, pending-transfer queues, or per-process locks. Browser state belongs to that user's layout; upstream banking state belongs to the API. Routing between replicas needs no sticky session for the current demo. The browser continues polling an initiated transfer by ID, whichever replica receives the GET.

The bank must enforce balance/limit checks atomically at initiation. Reading a balance and validating it here does not reserve funds and cannot prevent concurrent overspending. Adding an in-memory lock would not solve that across replicas.

The published initiation contract accepts a reference number but does not document a durable idempotency guarantee. Therefore initiation is never automatically retried, and timeouts remain an **unknown outcome**, not proof of failure. A disabled submit button prevents repeated clicks in one mounted form; it does not prevent duplicate transfers across tabs, devices, or network retries. Before public release, agree a provider idempotency contract or implement a durable, transactional operation ledger shared by all replicas, including reconciliation after a crash between upstream initiation and recording its result. A local Map or reuse of the reference string alone is insufficient.

## Public production release gates

1. Add a real authenticated identity provider and server-side account ownership/role authorization on every account, history, status, and transfer request. The shared integration key currently exposes one integration's data to every visitor. Origin checks mitigate browser cross-origin writes; they do not authenticate users. Until this is implemented, restrict the entire deployment to trusted evaluators behind an authenticated gateway.
2. Resolve dependency advisories. The audit of the assignment's pinned Svelte 4/SvelteKit/Vite stack reports security advisories, including high severity findings. Some Svelte fixes require Svelte 5; newer Kit APIs also require compatibility work. The baseline has intentionally not been silently migrated. Run `pnpm audit` after upgrading, then rerun browser and regression checks. A successful build is not a clean security audit.
3. Establish durable duplicate-submission prevention and unknown-outcome reconciliation with the banking provider as described above.
4. Rotate the temporary development integration key before release and use separate credentials per environment. Inject secrets at runtime, never through public environment variables.
5. Run representative load and soak tests against a sandbox with provider approval. Establish traffic/concurrency targets, upstream quotas, latency/error budgets, and connection limits. No capacity or availability target has been proven by local tests. Avoid load-testing live financial endpoints.

## Operational checks

- CI: frozen install → lint → Svelte/TypeScript checks → tests → production build → dependency audit. Treat advisory exceptions as explicit reviewed decisions.
- After deployment: verify readiness, account reads, pagination, and correlation IDs. Validate transfers only in a sandbox; do not use live transfers as routine health checks.
- Unknown transfer outcome: retain the transfer ID/reference, inspect history/status, and reconcile with the provider before retrying. Do not classify a timeout as a settled failure.
- Rollback: deploy the previous immutable build with the same runtime secret configuration. No local application database migration is required for the current demo.

Reference: [SvelteKit Node adapter operations](https://svelte.dev/docs/kit/adapter-node). Configure through `svelte.config.js` for this project's Kit 2 version; current Kit 3 documentation uses a different config location.
